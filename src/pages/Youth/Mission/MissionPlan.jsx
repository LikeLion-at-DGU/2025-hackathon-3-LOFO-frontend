//-----------모달창 테스트용 임시 페이지입니다.------------//

import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./Styled";

import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import { ShopCard } from "./components/ShopCard";
import { GoalField } from "./components/GoalField";
import { DueDateField } from "./components/DueDateField";
import { SubmitBar } from "./components/SubmitBar";

import { PlanGoalBox } from "./components/PlanGoalBox";
import { PlanMissionCard } from "./components/PlanMissionCard";
import { getAiMode } from "../../../ai/generatePlan";
import { createAiPlan } from "../../../apis/youth_Mission";

export default function MissionEditor({ 
  defaultGoal = "", defaultDueDate, onSubmit,
  // ✅ 서버에서 이미 존재하는 미션을 열 때 사용하는 선택적 prop
  initialSteps = null,      // [{idx,title,bullets,dueDate,status}]
  initialGoal = "",         // string
  initialDueDate = "",      // "YYYY-MM-DD"
  serverShop = null,        // { id,name,imageUrl,naverUrl,request }
  forcePlanPhase = false,   // true면 즉시 plan 단계로
}) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [phase, setPhase] = useState(forcePlanPhase ? "plan" : "edit");  // "edit" | "plan"
  const [mode, setMode] = useState(getAiMode?.() ?? "local");
  const [steps, setSteps] = useState(initialSteps);

  // ✅ 추가: 로딩/에러 상태 (API 대기 중 표시용)
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");

  const fallbackShop =
    (typeof window !== "undefined" &&
      JSON.parse(sessionStorage.getItem("lastShop") || "null")) || null;

  const rawShop = serverShop || state?.shop || fallbackShop || null;

  useEffect(() => {
    if (!rawShop) navigate("/youth/home", { replace: true });
  }, [rawShop, navigate]);

  const shop = rawShop || {
    id: undefined,
    name: "가게이름",
    imageUrl: "/fallback.jpg",
    naverUrl: "#",
    request: "요청 내용",
  };

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [goal, setGoal] = useState(initialGoal || defaultGoal);
  const [dueDate, setDueDate] = useState(initialDueDate || defaultDueDate || todayStr);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

   // ✅ 서버 초기값이 주어지면 즉시 plan 단계로 진입(초기 1회)
 useEffect(() => {
   if (forcePlanPhase && Array.isArray(initialSteps) && initialSteps.length) {
     setMode("server");
     setPhase("plan");
   }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

  // ✅ 클라이언트에서 “오늘 이후” 날짜 유효성
  const goalError =
    goal.trim().length === 0 ? "목표를 입력해주세요."
    : goal.trim().length < 8 ? "조금 더 구체적으로 작성해 주세요. (8자 이상)"
    : "";
  const isAfterToday = new Date(dueDate) >= new Date(todayStr);
  const dateError = isAfterToday ? "" : "오늘 이후 날짜를 선택하세요.";
  const isValid = !goalError && !dateError;

  // ✅ 서버 응답(step) → PlanMissionCard용 포맷으로 변환
  function mapStepsToCards(stepsFromApi, fallbackGoal, deadline) {
    if (!Array.isArray(stepsFromApi)) return [];

    const toYMD = (d) => {
      if (!d) return "";
      // 서버가 "2025-09-05" 또는 "2025-09-05T..." 둘 다 올 수 있으니 첫 10자만
      return String(d).slice(0, 10);
    };

    return stepsFromApi.map((s) => {
      // bullets: description 1줄 + reference(있다면 줄단위 분해)
      const refLines = typeof s.reference === "string"
        ? s.reference.split("\n").map((v) => v.replace(/^\s*-\s*/, "").trim()).filter(Boolean)
        : [];
      const bullets = [
        s.description?.trim() || `목표: ${fallbackGoal || "—"}`,
        ...refLines
      ];

      // ✅ “오늘 이후” 강제 보정(서버가 과거 날짜를 내려와도 UX 보호)
      const dueYmd = toYMD(s.due || deadline);
      const safeDue = (new Date(dueYmd) >= new Date(todayStr)) ? dueYmd : todayStr;

      return {
        idx: s.step_no ?? s.idx ?? 0,
        title: s.title || "단계",
        bullets,
        dueDate: safeDue,
      };
    }).sort((a, b) => a.idx - b.idx);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    const payload = {
      request_id: shop.id,            // ✅ API 스펙: request_id 사용
      goal: goal.trim(),
      deadline: dueDate,              // "YYYY-MM-DD"
    };

    try {
      setSubmitting(true);
      setError("");

      // (선택) 외부 저장
      if (onSubmit) await onSubmit(payload);

      // 새로고침 대비 seed 보관
      localStorage.setItem("lastMission", JSON.stringify({ goal: payload.goal, dueDate: payload.deadline }));

      // ✅ 실제 API 호출
      setPlanLoading(true);
      setPlanError("");

      const token = localStorage.getItem("accessToken"); // 프로젝트에 맞게 조정
      const res = await createAiPlan({ ...payload, token });
      // res: { mission: {...}, steps: [...] }

      // ✅ 응답 steps → 화면용 데이터로 변환
      const mapped = mapStepsToCards(res?.steps || [], payload.goal, payload.deadline);
      if (!mapped.length) throw new Error("생성된 단계가 없습니다.");

      setSteps(mapped);
      setMode(res?.mission?.ai_model || getAiMode?.() || "ai");
      setPhase("plan");
    } catch (err) {
      console.error(err);
      setPlanError(err?.response?.data?.message || err.message || "플랜 생성 중 오류가 발생했습니다.");
      setPhase("edit"); // 실패하면 작성 화면 유지
    } finally {
      setPlanLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <S.Page>
      <S.Shell>
        <YouthTopnav />
        <S.Main as={phase === "edit" ? "form" : "div"} onSubmit={phase === "edit" ? handleSubmit : undefined} noValidate>
          {/* ---------------- Left ---------------- */}
          <S.LeftCol>
            <ShopCard
              name={shop.name}
              imageUrl={shop.imageUrl}
              naverUrl={shop.naverUrl}
              request={shop.request}
            />

            {/* 결과 단계에서 목표/기한/모드 박스 */}
            {phase === "plan" && (
              <PlanGoalBox goal={goal} dueDate={dueDate} mode={mode} />
            )}
          </S.LeftCol>

          {/* ---------------- Right ---------------- */}
          <S.RightCol>
            {/* 로딩 상태 (API 대기) */}
            {planLoading && (
              <LoadingPanel />
            )}

            {/* 오류 메시지 */}
            {!planLoading && planError && (
              <S.GlobalError style={{ marginBottom: 12 }}>{planError}</S.GlobalError>
            )}

            {/* 작성 단계 */}
            {!planLoading && phase === "edit" && (
              <>
                <GoalField value={goal} onChange={setGoal} error={goalError} />
                <S.Spacer />
                <DueDateField value={dueDate} onChange={setDueDate} minDate={todayStr} error={dateError} />
                {error && <S.GlobalError>{error}</S.GlobalError>}
                <SubmitBar disabled={!isValid || submitting} loading={submitting} />
              </>
            )}

            {/* 결과 단계: 생성된 3단계 카드 */}
            {!planLoading && phase === "plan" && Array.isArray(steps) && steps.map((s) => (
              <div key={s.idx} style={{ marginBottom: 12 }}>
                <PlanMissionCard
                  idx={s.idx}
                  title={s.title}
                  bullets={s.bullets}
                  dueDate={s.dueDate}
                  cta={s.idx === 3 ? "추가 업로드" : "미션 업로드"}
                  onClick={() => console.log(`${s.idx}단계 업로드 클릭`)}
                />
              </div>
            ))}
          </S.RightCol>
        </S.Main>
      </S.Shell>
    </S.Page>
  );
}

/* ---------- 로딩 패널(간단 그래픽) ---------- */
function LoadingPanel() {
  return (
    <div style={{
      display: "grid",
      placeItems: "center",
      gap: 10,
      minHeight: 200,
      border: "1px dashed #cfe1ff",
      borderRadius: 12,
      background: "#f8fbff"
    }}>
      <Spinner />
      <div style={{ color: "#1d4ed8", fontWeight: 800 }}>AI가 플랜을 만드는 중…</div>
      <div style={{ color: "#3b82f6", fontSize: 12 }}>최대 5초 정도 걸릴 수 있어요</div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      border: "3px solid #bfdbfe", borderTopColor: "#2563eb",
      animation: "spin 0.8s linear infinite"
    }}/>
  );
}
// 전역 CSS 없으면 인라인 keyframes 대체:
const style = document?.createElement?.("style");
if (style) {
  style.innerHTML = `@keyframes spin { to { transform: rotate(360deg) } }`;
  document.head.appendChild(style);
}

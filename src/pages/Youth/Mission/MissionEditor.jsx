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
import { getAiMode } from "../../../ai/generatePlan"; // 모드 배지용(없으면 지워도 OK)

export default function MissionEditor({ defaultGoal = "", defaultDueDate, onSubmit }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  // ✅ 작성 단계/결과 단계 전환용
  const [phase, setPhase] = useState("edit"); // "edit" | "plan"
  const [steps, setSteps] = useState(null);
  const [mode, setMode] = useState(getAiMode?.() ?? "local");

  const fallbackShop =
    (typeof window !== "undefined" &&
      JSON.parse(sessionStorage.getItem("lastShop") || "null")) || null;

  const rawShop = state?.shop || fallbackShop || null;

  // shop 없으면 홈으로 (기존 유지)
  useEffect(() => {
  if (!rawShop) navigate("/youth/home", { replace: true }); // ← 여기!
}, [rawShop, navigate]);

  // 최종 사용 객체
  const shop = rawShop || {
    name: "가게이름",
    imageUrl: "/fallback.jpg",
    naverUrl: "#",
    request: "요청 내용",
    id: undefined,
  };

  // console.log 요청 정보 데이터 전달 확인 용도
  console.log("[EDITOR state.shop]", state?.shop);
  console.log("[EDITOR from session]", fallbackShop);
  console.log("[EDITOR final shop]", shop);


  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [goal, setGoal] = useState(defaultGoal);
  const [dueDate, setDueDate] = useState(defaultDueDate || todayStr);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const goalError =
    goal.trim().length === 0 ? "목표를 입력해주세요."
    : goal.trim().length < 8 ? "조금 더 구체적으로 작성해 주세요. (8자 이상)"
    : "";
  const dateError = new Date(dueDate) < new Date(todayStr) ? "오늘 이후 날짜를 선택하세요." : "";
  const isValid = !goalError && !dateError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    const payload = { shopId: shop.id, shopName: shop.name, goal: goal.trim(), dueDate };

    try {
      setSubmitting(true);
      setError("");

      // (선택) 외부 저장 로직
      if (onSubmit) await onSubmit(payload);

      // seed 저장 (새로고침 대비)
      const seed = { goal: payload.goal, dueDate: payload.dueDate };
      localStorage.setItem("lastMission", JSON.stringify(seed));

      // ✅ 이동하지 않고, 결과 뷰로 전환
      setSteps(fallbackSteps(seed.goal, seed.dueDate)); // 임시 3단계
      setMode(getAiMode?.() ?? "local");
      setPhase("plan"); // ← 여기!
    } catch (err) {
      console.error(err);
      setError("저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <S.Page>
      <S.Shell>
        <YouthTopnav />
         <S.Main as={phase === "edit" ? "form" : "div"} onSubmit={phase === "edit" ? handleSubmit : undefined} noValidate>
          <S.LeftCol>
            {/* ---------------- Left ---------------- */}
            {/* ✅ 여기서 item 쓰지 말고 shop을 그대로 꽂기 */}
            <ShopCard
              name={shop.name}
              imageUrl={shop.imageUrl}
              naverUrl={shop.naverUrl}
              request={shop.request}
            />
            {/* ✅ 결과 단계에서만 목표/기한/모드 박스 표시 */}
            {phase === "plan" && (
              <PlanGoalBox goal={goal} dueDate={dueDate} mode={mode} />
            )}
          </S.LeftCol>

          {/* ---------------- Right ---------------- */}
          <S.RightCol>
            {phase === "edit" ? (
              <>
                <GoalField value={goal} onChange={setGoal} error={goalError} />
                <S.Spacer />
                <DueDateField value={dueDate} onChange={setDueDate} minDate={todayStr} error={dateError} />
                {error && <S.GlobalError>{error}</S.GlobalError>}
                <SubmitBar disabled={!isValid || submitting} loading={submitting} />
              </>
            ) : (
              // ✅ 결과 단계: PlanMissionCard 3개
              <>
                {steps?.map((s) => (
                  <div key={s.idx}>
                    <PlanMissionCard
                      idx={s.idx}
                      title={s.title}
                      bullets={s.bullets}
                      dueDate={s.dueDate}
                      cta={s.idx === 2 ? "추가 업로드" : "미션 업로드"}
                      onClick={() => console.log(`${s.idx}단계 업로드 클릭`)}
                    />
                  </div>
                ))}
              </>
            )}
          </S.RightCol>
        </S.Main>
      </S.Shell>
    </S.Page>
  );
}

/* ---------- 임시 3단계 유틸 ---------- */
function fallbackSteps(goal, dueDate) {
  const d3 = new Date(dueDate || Date.now());
  const d2 = new Date(d3); d2.setDate(d3.getDate() - 14);
  const d1 = new Date(d3); d1.setDate(d3.getDate() - 28);

  const toYMD = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  return [
    {
      idx: 1,
      title: "콘셉트 방향 & 레퍼런스 보드",
      bullets: [
        `목표: ${goal || "—"}`,
        "톤앤매너·타깃 정의",
        "참고 레이아웃/이미지 수집",
      ],
      dueDate: toYMD(d1),
    },
    {
      idx: 2,
      title: "정보 구조 & 카피 초안",
      bullets: ["핵심 메시지/슬로건", "페이지 구성 초안", "이미지:텍스트 비율 가이드"],
      dueDate: toYMD(d2),
    },
    {
      idx: 3,
      title: "완성본 카드뉴스 제작",
      bullets: ["5~7장 디자인", "출력·업로드 규격 반영"],
      dueDate: toYMD(d3),
    },
  ];
}
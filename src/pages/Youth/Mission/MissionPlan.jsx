//--------------------이건 아마도 사용을 안 할 예정------------------------//

import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import { ShopCard } from "./components/ShopCard";

import { PlanGoalBox } from "./components/PlanGoalBox";
import { PlanMissionCard } from "./components/PlanMissionCard";

import { generatePlan, getAiMode } from "../../../ai/generatePlan";
//import { UploadModal } from "./components/UploadModal";


export default function MissionPlan() {
  const { state } = useLocation();
  const seed = useMemo(
    () => state ?? JSON.parse(localStorage.getItem("lastMission") || "{}"),
    [state]
  );

  const { goal, dueDate } = seed || {};
  const [steps, setSteps] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [progress, setProgress] = useState(""); // ★ 진행률 문구
  const [mode, setMode] = useState(getAiMode());

  // ▼ 추가: 모달 상태(현재 선택된 단계)
  const [activeStep, setActiveStep] = useState(null);
  //const openUploadModal = (step) => setActiveStep(step);
  //const closeUploadModal = () => setActiveStep(null);

  useEffect(() => {
    if (!goal || !dueDate) return;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const { steps, mode } = await generatePlan(goal, dueDate, (t) => setProgress(t));
        setSteps(steps);
        setMode(mode);
      } catch (e) {
        console.error(e);
        setErr("온디바이스 LLM 실행에 실패했어요. WebGPU 지원 여부를 확인해 주세요.");
        setSteps(fallbackSteps(goal, dueDate)); // 데모용 폴백
      } finally {
        setLoading(false);
      }
    })();
  }, [goal, dueDate]);

  return (
    <Page>
      <Shell>
        <YouthTopnav />

        <Main>
          {/* 왼쪽: 목표/기한 요약 */}
          <Left>
            <ShopCard
              name="충무노포"
              imageUrl="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1200&auto=format&fit=crop"
              naverUrl="#"
              request="앞 화면에서 작성한 목표와 마감기한을 확인하세요."
            />
            <PlanGoalBox goal={goal} dueDate={dueDate} mode={mode} />
          </Left>

          {/* 오른쪽: 생성된 3단계 */}
          <Right>
            {loading && (<Dim>
              계획 생성 중...<br />
              <small>{progress}</small>
            </Dim>)}
            {err && <Warn>{err}</Warn>}
            {steps?.map((s) => (
              <Item key={s.idx}>
                <aiMissionCard
                  idx={s.idx}
                  title={s.title}
                  bullets={s.bullets}
                  dueDate={s.dueDate}
                  cta={s.idx === 2 ? "추가 업로드" : "미션 업로드"}
                  onClick={() => alert(`${s.idx}단계 업로드 클릭!`)}
                />
              </Item>
            ))}
          </Right>
        </Main>
      </Shell>

      {/* ▼ 페이지 어디에서나 뜨도록 하단에 배치 */}
      <UploadModal
        open={!!activeStep}
        onClose={closeUploadModal}
        step={activeStep}
      />
      
    </Page>
  );
}

/* ---- 폴백(둘 다 실패 시) ---- */
function fallbackSteps(goal, dueDate) {
  const d3 = new Date(dueDate);
  const d2 = new Date(d3); d2.setDate(d3.getDate() - 14);
  const d1 = new Date(d3); d1.setDate(d3.getDate() - 28);
  const toYMD = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  return [
    {
      idx: 1,
      title: "콘셉트 방향 & 레퍼런스 보드",
      bullets: [`목표: ${goal}`, "톤앤매너·타깃 정의", "참고 레이아웃/이미지 수집"],
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

/* ---- styles ---- */
const Page = styled.div`width:100%;min-height:100vh;display:flex;justify-content:center;`;
const Shell = styled.div`width:1100px;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.06);overflow:hidden;margin:24px 0;`;
const Main = styled.div`display:grid;grid-template-columns:320px 1fr;gap:24px;padding:24px;@media (max-width:960px){grid-template-columns:1fr;}`;
const Left = styled.aside`display:flex;flex-direction:column;gap:16px;`;
const Right = styled.section`display:flex;flex-direction:column;gap:16px;`;
const Item = styled.div``;

const GoalBox = styled.div`
  border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#fafafa;
`;
const GoalTitle = styled.h4`margin:0 0 8px;font-weight:700`;
const GoalText = styled.p`margin:0 0 8px;white-space:pre-wrap`;
const Row = styled.div`display:flex;justify-content:space-between;color:#374151;`;

const ModePill = styled.span`
  display:inline-block;margin-top:10px;padding:6px 10px;border-radius:999px;
  border:1px solid ${({$mode}) => $mode==="local" ? "#86efac" : "#93c5fd"};
  background: ${({$mode}) => $mode==="local" ? "#dcfce7" : "#dbeafe"};
  color: ${({$mode}) => $mode==="local" ? "#166534" : "#1d4ed8"};
  font-weight:700;font-size:12px;
`;

const Dim = styled.div`padding:24px;text-align:center;color:#6b7280;`;
const Warn = styled.div`padding:12px;border:1px solid #fecaca;background:#fee2e2;border-radius:10px;color:#b91c1c;`;
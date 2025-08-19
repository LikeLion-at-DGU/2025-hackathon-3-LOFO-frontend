import { useMemo, useState } from "react";
import styled from "styled-components";
import { YouthTopnav } from "../../../components/Topnav/YouthTopnav";
import { ShopCard } from "./components/ShopCard";
import { GoalField } from "./components/GoalField";
import { DueDateField } from "./components/DueDateField";
import { SubmitBar } from "./components/SubmitBar";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

export default function MissionEditor({
  shop = {
    name: "충무노포",
    imageUrl:
      "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1200&auto=format&fit=crop",
    naverUrl: "#",
    request:
      "카드뉴스를 만들어주세요. 저희 가게에 새로운 메뉴가 나왔는데, 이에 맞춘 홍보물이 필요합니다. 메뉴는 삼각김치찜이고, 김치가 묵은지인게 강조되면 좋겠습니다.",
  },
  defaultGoal = "",
  defaultDueDate, // "YYYY-MM-DD"
  onSubmit, // (payload) => Promise|void
}) {
  const navigate = useNavigate();

  // ❌ (삭제) 선언 전 참조/즉시 네비게이션 금지
  // const payload = { goal: goal.trim(), dueDate };
  // localStorage.setItem("lastMission", JSON.stringify(payload));
  // navigate("/youth/missions/plan", { state: payload });

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const initialDue = defaultDueDate || todayStr;

  const [goal, setGoal] = useState(defaultGoal);
  const [dueDate, setDueDate] = useState(initialDue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // --- 검증 ---
  const goalError =
    goal.trim().length === 0
      ? "목표를 입력해주세요."
      : goal.trim().length < 8
      ? "조금 더 구체적으로 작성해 주세요. (8자 이상)"
      : "";

  const dateError =
    new Date(dueDate) < new Date(todayStr) ? "오늘 이후 날짜를 선택하세요." : "";

  const isValid = !goalError && !dateError;

  // --- 제출 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    // ★ 제출 시점에 payload 생성
    const payload = {
      shopName: shop.name,
      goal: goal.trim(),
      dueDate,
    };

    try {
      setSubmitting(true);
      setError("");

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // const base = import.meta.env.VITE_API_BASE_URL;
        // await axios.post(new URL("/missions", base).toString(), payload);
        console.log("미션 제출 payload:", payload);
      }

      // ★ 다음 화면용으로 최소 데이터 저장 및 state로 전달
      const seed = { goal: payload.goal, dueDate: payload.dueDate };
      localStorage.setItem("lastMission", JSON.stringify(seed)); // 안전망
      navigate("/youth/mission/plan", { state: seed });         // 다음 화면으로 이동
    } catch (err) {
      console.error(err);
      setError("저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <Shell>
        <YouthTopnav />

        <Main as="form" onSubmit={handleSubmit} noValidate>
          <LeftCol>
            <ShopCard
              name={shop.name}
              imageUrl={shop.imageUrl}
              naverUrl={shop.naverUrl}
              request={shop.request}
            />
          </LeftCol>

          <RightCol>
            <GoalField value={goal} onChange={setGoal} error={goalError} />
            <Spacer />
            <DueDateField
              value={dueDate}
              onChange={setDueDate}
              minDate={todayStr}
              error={dateError}
            />
            {error && <GlobalError>{error}</GlobalError>}
            <SubmitBar disabled={!isValid || submitting} loading={submitting} />
          </RightCol>
        </Main>
      </Shell>
    </Page>
  );
}

/* ------------------------ layout styles ------------------------ */
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const Shell = styled.div`
  width: 1100px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin: 24px 0;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  padding: 24px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCol = styled.aside``;

const RightCol = styled.section`
  padding: 8px 4px 8px 0;
`;

const Spacer = styled.div`
  height: 16px;
`;

const GlobalError = styled.div`
  margin-top: 8px;
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
`;

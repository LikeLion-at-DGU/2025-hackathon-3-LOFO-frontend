import styled from "styled-components";

/*MissionEditor*/
export const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

export const Shell = styled.div`
  width: 1100px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin: 24px 0;
`;

export const Main = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  padding: 24px;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftCol = styled.aside``;
//export const Left = styled.aside`display:flex;flex-direction:column;gap:16px;`;

export const RightCol = styled.section`
  padding: 8px 4px 8px 0;
`;

export const Spacer = styled.div`
  height: 16px;
`;

export const GlobalError = styled.div`
  margin-top: 8px;
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
`;

/*PlanGoalBox*/
export const GoalBox = styled.div`
  border:1px solid #e5e7eb;border-radius:12px;padding:16px;background:#fafafa;
`;
export const GoalTitle = styled.h4`
    margin:0 0 8px;font-weight:700;
`
export const GoalText = styled.p`
    margin:0 0 8px;white-space:pre-wrap;
`
export const Row = styled.div`
    display:flex;justify-content:space-between;color:#374151;
`
export const ModePill = styled.span`
  display:inline-block;margin-top:10px;padding:6px 10px;border-radius:999px;
  border:1px solid ${({$mode}) => $mode==="local" ? "#86efac" : "#93c5fd"};
  background: ${({$mode}) => $mode==="local" ? "#dcfce7" : "#dbeafe"};
  color: ${({$mode}) => $mode==="local" ? "#166534" : "#1d4ed8"};
  font-weight:700;font-size:12px;
`;
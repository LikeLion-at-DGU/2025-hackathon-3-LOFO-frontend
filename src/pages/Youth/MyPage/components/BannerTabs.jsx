import styled, { css } from "styled-components";

export function BannerTabs({ value, onChange }) {
  return (
    <TabsWrap>
      <Tab
        $active={value === "portfolio"}
        onClick={() => onChange("portfolio")}
      >
        포트폴리오
      </Tab>
      <Tab $active={value === "growth"} onClick={() => onChange("growth")}>
        성장 지표
      </Tab>
      <Tab $active={value === "activity"} onClick={() => onChange("activity")}>
        내 활동
      </Tab>
      <Underline
        $index={value === "portfolio" ? 0 : value === "growth" ? 1 : 2}
      />
    </TabsWrap>
  );
}

const TabsWrap = styled.div`
  position: relative;
  display: inline-grid;
  grid-auto-flow: column;
  gap: 28px;
  align-items: center;
  height: 48px;
`;

const Tab = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  padding: 0 2px 8px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ $active }) => ($active ? "#1f2937" : "#6b7280")};
  cursor: pointer;

  &:hover {
    color: #111827;
  }
`;

const Underline = styled.i`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 33%;
  background: #2563eb;
  border-radius: 99px;
  transform: translateX(${({ $index }) => $index * 365}px);
  transition: transform 200ms ease;
`;

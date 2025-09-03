import styled from "styled-components";

export const Card = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 25px 35px 35px 35px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin: 130px 60px -60px 40px;
  align-self: stretch;
  border-radius: 0 0 20px 20px;
  border: 1px solid ${(p) => (p.$disabled ? "#e5e7eb" : "#1787FF")} ;
  background: ${(p) => (p.$disabled ? "#f6f7fb" : "#ffffff")};
  box-shadow: ${(p) =>
   p.$disabled
     ? "0 2px 48px -8px rgba(54, 143, 239, 0.12)"  /* 은은한 파란 그림자 */
     : "0 2px 48px -8px rgba(54, 143, 239, 0.20)"};
  position: relative;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
  //* {border: 1px solid;}
`;

export const Left = styled.div`
  display: flex;
  gap: 14px;
  min-width: 0; /* 제목 줄바꿈 안전 */
`;

export const IdxBadge = styled.div`
  width: 28px;
  height: 28px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  padding: 8px 22px;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 10px 10px 0 0;
  background: ${(p) => (p.$disabled ? "#999" : "#1787FF")};

  position: absolute;
  top: -29px;
  left: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const Badge = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => (p.$disabled ? "#b0b8c3" : "#999")};
`;

export const Title = styled.span`
  color: ${(p) => (p.$disabled ? "#9aa3b2" : "#1787FF")};
  font-weight: 800;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 20px;
  margin-bottom: 3px;
  //pointer-events: ${(p) => (p.$disabled ? "none" : "auto")};
`;

export const Bullets = styled.ul`
  font-size: 15px;
  margin: 0;
  padding-left: 18px;
  color: ${(p) => (p.$disabled ? "#a3a3a3" : "#374151")};
  line-height: 1.55;

  li {
    list-style: disc;
  }
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const DuePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 700;
  color: ${(p) => (p.$disabled ? "#9ca3af" : "#1d4ed8")};

  span {
    font-size: 12px;
    color: ${(p) => (p.$disabled ? "#b0b8c3" : "#1787FF")};
    font-weight: 400;
  }
  strong {
    font-size: 15px;
    font-weight: 400;
    color: ${(p) => (p.$disabled ? "#9aa3b2" : "#000")};
  }
`;

export const CalendarIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: ${(p) => (p.$disabled ? "#b0b8c3" : "#1787FF")};
`;

export const UploadBtn = styled.button`
display: flex;
padding: 10px 20px;
align-items: center;
gap: 10px;
border-radius: 100px;
border: 1px solid #ADD5FF;
background: #FFF;
box-shadow: 0 4px 12px 0 rgba(54, 143, 239, 0.50);

color: #368FEF;
font-weight: 600;
font-size: 15px;
cursor: pointer;

  &:hover {
    filter: brightness(0.98);
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    background: #f6f7fb;
    border-color: #e5e7eb;
    box-shadow: none;
    color: #9aa3b2;
    cursor: not-allowed;
    filter: none;
    transform: none;
  }
`;

export const UploadIcon = styled.svg`
  width: 23px;
  height: 23px;
`;
import styled from "styled-components";

export const Card = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 30px 40px 40px 40px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin: 140px 50px -70px 20px;
  align-self: stretch;
  border-radius: 0 0 20px 20px;
  border: 1px solid ${(p) => (p.$disabled ? "#e5e7eb" : "#1787FF")} ;
  background: ${(p) => (p.$disabled ? "#f6f7fb" : "#ffffff")};
  box-shadow: ${(p) => (p.$disabled ? "none" : "0 2px 48px -8px rgba(54, 143, 239, 0.20)")}; /* 은은한 파란 그림자 */


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
  background: #1787FF;

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
  color: #999;
`;

export const Title = styled.span`
  color: ${(p) => (p.$disabled ? "#9aa3b2" : "#1787FF")};
  font-weight: 800;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 22px;
  margin-bottom: 5px;
  

  &:hover {
    text-decoration: underline;
  }
`;

export const Bullets = styled.ul`
  font-size: 18px;
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
  color: #1d4ed8;
  font-weight: 700;

  span {
    font-size: 14px;
    color: #1787FF;
    font-weight: 400;
  }
  strong {
    font-size: 17px;
    font-weight: 400;
    color: #000000ff;
  }
`;

export const CalendarIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: #1787FF;
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
font-size: 17px;
cursor: pointer;

  &:hover {
    filter: brightness(0.98);
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const UploadIcon = styled.svg`
  width: 23px;
  height: 23px;
`;
import styled from "styled-components";

export const Card = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 2px solid ${(p) => (p.$disabled ? "#e5e7eb" : "#cfe1ff")};           /* 파란 외곽선 */
  background: ${(p) => (p.$disabled ? "#f6f7fb" : "#ffffff")};
  border-radius: 16px;
  box-shadow: ${(p) => (p.$disabled ? "none" : "0 6px 20px rgba(60,104,255,.08)")}; /* 은은한 파란 그림자 */

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
`;

export const Left = styled.div`
  display: flex;
  gap: 14px;
  min-width: 0; /* 제목 줄바꿈 안전 */
`;

export const IdxBadge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(180deg, #5ea8ff 0%, #2f6bff 100%);
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
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
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 999px;
`;

export const Title = styled.a`
  color: ${(p) => (p.$disabled ? "#9aa3b2" : "#1d4ed8")};
  font-weight: 800;
  line-height: 1.2;
  min-width: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover {
    text-decoration: underline;
  }
`;

export const Bullets = styled.ul`
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
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const DuePill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid #93c5fd;
  background: #ebf5ff;
  color: #1d4ed8;
  font-weight: 700;

  span {
    font-size: 12px;
    color: #3b82f6;
    font-weight: 600;
  }
  strong {
    font-weight: 800;
    color: #1e40af;
  }
`;

export const CalendarIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

export const UploadBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #93c5fd;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    filter: brightness(0.98);
  }
  &:active {
    transform: translateY(1px);
  }
`;

export const UploadIcon = styled.svg`
  width: 18px;
  height: 18px;
`;
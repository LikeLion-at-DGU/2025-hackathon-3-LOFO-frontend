import styled from "styled-components";

/**
 * Props
 * - idx: number (1,2,3)
 * - title: string
 * - bullets: string[]
 * - dueDate: "YYYY-MM-DD"
 * - cta: string ("미션 업로드" | "추가 업로드" 등)
 * - onClick: () => void
 */
export function PlanMissionCard({ idx, title, bullets = [], dueDate, cta = "미션 업로드", onClick }) {
  return (
    <Card>
      <Left>
        <IdxBadge>{idx}</IdxBadge>

        <Content>
          <HeaderRow>
            <Badge>미션</Badge>
            <Title href="#" onClick={(e) => e.preventDefault()}>
              {title}
            </Title>
          </HeaderRow>

          <Bullets>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </Bullets>
        </Content>
      </Left>

      <Right>
        <DuePill>
          <CalendarIcon viewBox="0 0 24 24" aria-hidden>
            <path d="M7 2v2M17 2v2M4 7h16M6 12h4M6 16h4M12 12h6M12 16h6M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </CalendarIcon>
          <span>마감기한</span>
          <strong>{formatKR(dueDate)}</strong>
        </DuePill>

        <UploadBtn type="button" onClick={onClick}>
          <UploadIcon viewBox="0 0 24 24" aria-hidden>
            <path d="M12 16V8M8.5 11.5 12 8l3.5 3.5M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </UploadIcon>
          {cta}
        </UploadBtn>
      </Right>
    </Card>
  );
}

/* ----------------------------- styles ----------------------------- */

const Card = styled.article`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;

  padding: 18px 20px;
  border: 2px solid #cfe1ff;                 /* 파란 외곽선 */
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(60, 104, 255, 0.08); /* 은은한 파란 그림자 */

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
`;

const Left = styled.div`
  display: flex;
  gap: 14px;
  min-width: 0; /* 제목 줄바꿈 안전 */
`;

const IdxBadge = styled.div`
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Badge = styled.span`
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 2px 8px;
  border-radius: 999px;
`;

const Title = styled.a`
  color: #1d4ed8;
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

const Bullets = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: #374151;
  line-height: 1.55;

  li {
    list-style: disc;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const DuePill = styled.div`
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

const CalendarIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

const UploadBtn = styled.button`
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

const UploadIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

/* YYYY-MM-DD → "M월 D일" */
function formatKR(ymd) {
  if (!ymd) return "—";
  const [y, m, d] = ymd.split("-").map(Number);
  return `${m}월 ${d}일`;
}

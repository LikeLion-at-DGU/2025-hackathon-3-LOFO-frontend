import styled from "styled-components";

export function ProfileCard({ name, phone, stats }) {
  const { completed, inProgress, picks, total } = stats || {};
  return (
    <Card>
      <AvatarWrap>
        <Logo>누</Logo>
      </AvatarWrap>

      <UserName>{name}</UserName>
      <Phone>{phone}</Phone>

      <Divider />

      <StatList>
        <li>
          <span>작업 완료</span>
          <b>{completed ?? 0}</b>
        </li>
        <li>
          <span>진행 중</span>
          <b>{inProgress ?? 0}</b>
        </li>
        <li>
          <span>PICK 수</span>
          <b>{picks ?? 0}</b>
        </li>
        <li>
          <span>총 참여 개수</span>
          <b>{total ?? 0}</b>
        </li>
      </StatList>
    </Card>
  );
}

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 20px 16px;
  box-shadow: 0 4px 16px rgba(16, 24, 40, 0.06);
`;

const AvatarWrap = styled.div`
  display: grid;
  place-items: center;
  margin: 8px 0 12px;
`;

const Logo = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #2563eb;
  color: #fff;
  font-weight: 800;
  font-size: 24px;
`;

const UserName = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: #111827;
`;

const Phone = styled.div`
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #eef2f7;
  margin: 16px 0;
`;

const StatList = styled.ul`
  display: grid;
  gap: 6px;
  li {
    display: grid;
    grid-template-columns: 1fr auto;
    font-size: 13px;
    color: #6b7280;

    b {
      font-weight: 700;
      color: #111827;
    }
  }
`;

import styled from "styled-components";

export function ShopCard({ name, imageUrl, naverUrl, request }) {
  return (
    <Card>
      <ShopImg src={imageUrl} alt={`${name} 사진`} />
      <ShopName>{name}</ShopName>
      <NaverLink href={naverUrl} target="_blank" rel="noreferrer">
        네이버 링크 바로가기
      </NaverLink>

      <Divider />

      <SectionTitle>상인의 요청</SectionTitle>
      <RequestBox>{request}</RequestBox>
    </Card>
  );
}

const Card = styled.div`
    display: inline-flex;
    height: 936px;
    padding: 100px 41px 61px 41px;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    flex-shrink: 0;
    background: var(--white, #FFF);
    box-shadow: 0 -9px 20px 0 rgba(0, 0, 0, 0.25);
`;


const ShopImg = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
`;

const ShopName = styled.h3`
  margin: 12px 0 6px;
  font-size: 20px;
  font-weight: 700;
`;

const NaverLink = styled.a`
  display: inline-block;
  font-size: 14px;
  color: #10b981;
  text-decoration: underline;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #e5e7eb;
  margin: 14px 0;
`;

const SectionTitle = styled.h4`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const RequestBox = styled.p`
  white-space: pre-wrap;
  font-size: 14px;
  color: #374151;
  line-height: 1.55;
`;

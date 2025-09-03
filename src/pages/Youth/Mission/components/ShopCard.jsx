// ShopCard.jsx
import styled from "styled-components";

export function ShopCard({ name, imageUrl, naverUrl, request, children }) {
  return (
    <Card>
      <ShopImg src={imageUrl} alt={`${name} 사진`} />
      <ShopName>{name}</ShopName>
      <LinkDiv>
      <N>N</N>
      <NaverLink href={naverUrl} target="_blank" rel="noreferrer">
        네이버 링크 바로가기
      </NaverLink>
      </LinkDiv>
      
      <Divider />

      <Field>
        <SectionTitle>상인의 요청</SectionTitle>
        <RequestBox>{request}</RequestBox>
      </Field>

      {/* ✅ children 이 오면 내부 섹션으로 붙이기 */}
      {children && (
        <>
          <Divider />
          <Field>
            {children}
          </Field>
        </>
      )}
    </Card>
  );
}

const Card = styled.div`
  display: inline-flex;
  height: 100vh;
  width: 350px;
  padding: 140px 50px 61px 50px;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;                 /* 스티키 올바르게 고정 */
  gap: 20px;
  flex-shrink: 0;
  background: #fff;
  box-shadow: 0 -9px 20px 0 rgba(0,0,0,0.25);
  margin-left: -30px;

  /* ✅ 콘텐츠가 길어질 때 스크롤 가능 */
  overflow-y: auto;
`;

const ShopImg = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 20px;
`;

const ShopName = styled.h3`
  margin: 12px 0 6px;
  font-size: 26px;
  font-weight: 700;
  text-align: center;
`;

const Field = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: -30px;
`;

const LinkDiv = styled.div`
  display:flex;
  gap: 5px;
`
const NaverLink = styled.a`
  display: inline-block;
  font-size: 14px;
  color: #636363;
  text-decoration: underline;
`;
const N = styled.div`
 font-size: 12px;
 color: white;
 text-align: center;
 padding: 1px;
 width: 20px;
 border-radius: 100%;
 background-color: #4CAF50;
 font-weight: 600;
`

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #e5e7eb;
  margin: 14px 0;
`;

const SectionTitle = styled.span`
  color: var(--main-001, #368FEF);
  font-size: 18px;
  font-weight: 400;
  line-height: normal;
`;

const RequestBox = styled.p`
  white-space: pre-wrap;
  font-size: 14px;
  color: #374151;
  line-height: 1.55;
`;

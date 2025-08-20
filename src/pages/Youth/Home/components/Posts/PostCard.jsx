import styled from "styled-components";

const Card = styled.article`
  border-radius: 16px; overflow: hidden; position: relative;
  background: #000; color: #fff; cursor: pointer;
  box-shadow: 0 6px 24px rgba(0,0,0,.12);
`;
const Thumb = styled.img`
  width: 100%; height: 160px; object-fit: cover; display: block; opacity: 0.85;
`;
const Body = styled.div`
  position: absolute; left: 0; right: 0; bottom: 0; padding: 14px;
  display: flex; flex-direction: column; gap: 6px;
`;
const Title = styled.h3` font-size: 16px; font-weight: 700; `;
const Meta = styled.div` font-size: 12px; opacity: .9; `;

export default function PostCard({ item, onClick }) {
  return (
    <Card onClick={() => onClick?.(item)}>
      <Thumb src={item.thumbnailUrl} alt={item.title} />
      <Body>
        <Title>{item.title}</Title>
        <Meta>{item.region} · {item.category}</Meta>
      </Body>
    </Card>
  );
}

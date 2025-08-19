import styled from "styled-components";
import PostCard from "./PostCard";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export default function PostGrid({ items, onClickCard }) {
  return (
    <Grid>
      {items.map((it) => (
        <PostCard key={it.id} item={it} onClick={onClickCard} />
      ))}
    </Grid>
  );
}

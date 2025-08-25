import styled from "styled-components";
import PostGrid from "../../../Home/components/Posts/PostGrid"; 
import PostCard from "../../../Home/components/Posts/PostCard";   

export function LofoPickSection({ posts = [] }) {
  return (
    <Card>
      <PostGrid
        items={posts}
        renderItem={(p) => <PostCard key={p.id} item={p} />}
      />
    </Card>
  );
}

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 20px;
`;

import styled from "styled-components";
import PostGrid from "../../../Home/components/Posts/PostGrid"; // 네 파일트리 기준
import PostCard from "../../../Home/components/Posts/PostCard";   // 네 파일트리 기준

export function LofoPickSection({ posts = [] }) {
  return (
    <Card>
      <PostGrid
        items={posts}
        renderItem={(p) => <PostCard key={p.id} {...p} />}
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

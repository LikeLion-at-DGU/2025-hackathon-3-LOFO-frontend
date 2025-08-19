import styled from "styled-components";
import PostGrid from "../../Home/components/Posts/PostGrid";
import Post from "../../Home/components/Posts/PostCard";

export function PostGridSection({ posts }) {
  return (
    <Card>
      <PostGrid
        items={posts}
        renderItem={(p) => <Post key={p.id} {...p} />}
      />
    </Card>
  );
}

const Card = styled.section`
  background: white;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 24px;
`;

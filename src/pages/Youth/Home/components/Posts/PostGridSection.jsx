//-----------------------이건 아마 안 쓸 예정-------------------------//

import styled from "styled-components";
import PostGrid from "./PostGrid";
import Post from "./PostCard";

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

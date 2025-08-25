import styled from "styled-components";
import { useState } from "react";
import FeedbackDetailModal from "./FeedbackDetailModal";

export function FeedbackList({ items = [] }) {
  const [openId, setOpenId] = useState(null);

  return (
    <>
    <List>
      {items.map(({ id, text }) => (
        <Item key={id} onClick={() => setOpenId(id)}>
          <span>{text}</span>
        </Item>
      ))}
      </List>
      
      <FeedbackDetailModal
        open={!!openId}
        outcomeId={openId}
        onClose={() => setOpenId(null)}
      />
    </>
    
  );
}

const List = styled.div`
  display: grid;
  gap: 12px;
  padding: 20px;
  width: 100%;
`;

const Item = styled.div`
  display: flex;
padding: 30px 24px;
align-items: center;
gap: 10px;
align-self: stretch;
border-radius: 20px;
border: 1px solid var(--main-001, #368FEF);
background: #FFF;

/* 001 */
box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.25);
`;

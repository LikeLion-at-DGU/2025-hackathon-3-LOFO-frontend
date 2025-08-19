import styled from "styled-components";

export function FeedbackList({ items = [] }) {
  return (
    <List>
      {items.map(({ id, text }) => (
        <Item key={id}>
          <span>{text}</span>
        </Item>
      ))}
    </List>
  );
}

const List = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  border: 1px solid #cfe3ff;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 0 rgba(16, 24, 40, 0.04);
  font-size: 14px;
  color: #111827;
`;

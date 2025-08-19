import styled from "styled-components";

const Bar = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; padding: 12px 0 24px;
`;
const Chip = styled.button`
  padding: 8px 14px; border-radius: 999px;
  border: 1px solid #ddd; 
  background: ${({active})=>active?"#111":"#fff"};
  color: ${({active})=>active?"#fff":"#333"}; cursor: pointer;
`;

export default function CategoryFilter({ categories, value, onChange }) {
  return (
    <Bar>
      {categories.map((c) => (
        <Chip key={c} active={value===c} onClick={() => onChange(c)}>{c}</Chip>
      ))}
    </Bar>
  );
}

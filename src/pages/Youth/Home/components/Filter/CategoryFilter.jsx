import styled from "styled-components";

const Bar = styled.div`
  display: flex; gap: 20px; flex-wrap: wrap; padding: 12px 0 24px;
  display: inline-block;
`;
const Chip = styled.button`
  padding: 8px 30px;
  margin-right: 20px; 
  border-radius: 100px;
  border: 1px solid #ddd; 
  color: ${({active})=>active?"#fff":"#4F4F4F"};
  background: ${({active})=>active?"#59418F":"#ECECEC"};
  cursor: pointer;
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

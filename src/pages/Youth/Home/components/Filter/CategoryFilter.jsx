//---------------폐기예정-------------------//

import styled from "styled-components";

const Bar = styled.div`
  display: flex; gap: 20px; flex-wrap: wrap; padding: 12px 0 24px;
  display: inline-block;
`;
const Chip = styled.button`
  padding: 6px 24px;
  margin-right: 15px; 
  border-radius: 100px;
  border: 1px solid #ddd; 
  color: ${({active})=>active?"#fff":"#4F4F4F"};
  background: ${({active})=>active?"#59418F":"#ECECEC"};
  cursor: pointer;

  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  text-align: center;
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

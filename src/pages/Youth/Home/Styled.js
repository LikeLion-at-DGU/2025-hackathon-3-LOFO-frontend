import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  max-width: 1120px;
  margin: 100px auto 0 auto; 
  padding: 0 20px 80px;
`;
export const HeroWrapper = styled.div`
  background: #fff;
  border-bottom: 1px solid var(--line-001, #BABABA);
  width: 100%;
`
export const FilterWrapper = styled.div`
    display:"flex";
    align-items:"center";
    justify-content:"space-between";
    gap:100px;
    margin-bottom:16;
`;
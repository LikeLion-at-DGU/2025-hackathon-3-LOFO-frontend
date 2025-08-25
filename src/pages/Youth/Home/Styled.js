import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  min-height: 100vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  margin: 100px auto 0 auto; 
  padding: 0 20px 80px;
`;
export const Shell = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin: 24px 0;
`;
export const HeroWrapper = styled.div`
  background: #fff;
  border-bottom: 1px solid var(--line-001, #BABABA);
  width: 100%;
  padding: 0 30px;
`
export const FilterWrapper = styled.div`
    display:"flex";
    align-items:"center";
    justify-content:"space-between";
    gap: auto;
    margin-bottom:16;
`;
export const ErrMsg = styled.div`
  margin: auto;
  text-align: center;
`
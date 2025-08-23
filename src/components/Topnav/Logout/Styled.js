import styled from "styled-components";

export const Btn = styled.button`
all: unset;
cursor: pointer;
display: flex;
padding: 6px 20px;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 100px;
border: 1px solid var(--main-003, #8B6FD4);
background: var(--white, #FFF);
color: #8B6FD4;
font-size: 16px;
font-weight: 600;
margin-left: auto;

/*opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};*/
`
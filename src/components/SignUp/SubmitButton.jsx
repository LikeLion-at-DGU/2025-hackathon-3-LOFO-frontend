import { styled } from "styled-components";

const Button = styled.button`
all: unset;
cursor: pointer;
display: flex;
height: 55px;
align-self: stretch;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 20px;
background: var(--main-001, #368FEF);
color: var(--white, #FFF);
font-family: "Pretendard Variable";
font-size: 17px;
font-style: normal;
font-weight: 600;
line-height: normal;

opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`

function SubmitButton ({ button, type = "submit", disabled, onClick }) {
  return (
    <Button type={type} disabled={disabled} onClick={onClick}>
      {button}
    </Button>
  );
}

export default SubmitButton;
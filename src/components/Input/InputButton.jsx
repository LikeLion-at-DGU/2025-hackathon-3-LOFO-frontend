import { styled } from "styled-components";

const Button = styled.button`
all: unset;
cursor: pointer;
display: flex;
height: 66px;
align-self: stretch;
justify-content: center;
align-items: center;
gap: 10px;
border-radius: 20px;
background: var(--main-001, #368FEF);
color: var(--white, #FFF);
font-family: "Pretendard Variable";
font-size: 22px;
font-style: normal;
font-weight: 600;
line-height: normal;
`

function InputButton(props) {
  return (
    <Button>
      {props.button}
    </Button>
  );
};

export default InputButton;
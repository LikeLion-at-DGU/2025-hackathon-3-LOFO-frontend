import { styled } from "styled-components";

const Field = styled.div`
display: flex;
height: 66px;
align-self: stretch;
padding: 20px;
align-items: center;
gap: 10px;
border-radius: 20px;
border: 1px solid var(--line-001, #BABABA);
background: #FFF;
`

function InputField(props) {
  return (
    <Field>
      <input type="text" placeholder={props.placeholder} style={{color: '#999', fontSize: '22px',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 'normal',
    border: 'none',
    outline: 'none'}}/>
    </Field>
  );
};

export default InputField;
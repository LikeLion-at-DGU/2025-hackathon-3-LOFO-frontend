import { styled } from "styled-components";

const Field = styled.div`
  display: flex; height: 55px; align-self: stretch; padding: 20px;
  align-items: center; gap: 10px; border-radius: 20px;
  border: 1px solid var(--line-001, #BABABA); background: #FFF;
`;

function InputField({
  value,
  onChange,
  placeholder,
  type = "text",
  name,
  maxLength,
}) {
  return (
    <Field>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          color: "#333",
          fontSize: "17px",
          fontWeight: 400,
          lineHeight: "normal",
          border: "none",
          outline: "none",
          width: "100%",
        }}
      />
    </Field>
  );
}

export default InputField;

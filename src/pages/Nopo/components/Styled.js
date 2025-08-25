import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 55px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
  overflow-y: auto;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 130px;
  margin-top: 80px;
`;
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 10px;
`;
export const Label = styled.label`
  font-weight: 700;
  font-size: 30px;
  line-height: 100%;
  /* margin-bottom: 8px; */
`;
export const Required = styled.span`
  color: #ef4444;
`;
export const Desc = styled.p`
  font-size: 15px;
  color: rgba(79, 79, 79, 1);
`;
export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  &::placeholder {
    color: #aaa;
  }
`;
export const Input = styled.input`
  width: 100%;
  padding: 20px 30px;
  font-size: 14px;
  outline: none;
  border-radius: 13px;
  border: 1px solid var(--line-001, #bababa);
  background: var(--white, #fff);
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);
  &::placeholder {
    color: #aaa;
  }
  margin: 3px;
`;

export const FileUpload = styled.div`
  padding: 40px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background-color: #f0f6ff;
  text-align: center;
  font-size: 14px;
  color: #2563eb;
  input {
    cursor: pointer;
  }
`;
export const CategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 800px;
  gap: 11px;
`;

export const CategoryButton = styled.button`
  width: 150px;
  height: 60px;
  border: 1px solid rgba(186, 186, 186, 1);
  border-radius: 13px;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 20px;
  background-color: ${({ $selected }) =>
    $selected ? "rgba(225, 149, 67, 1)" : "#fff"};
  color: ${({ $selected }) => ($selected ? "#fff" : "#333")};
  font-weight: ${({ $selected }) => ($selected ? "700" : "500")};
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.25);
  transition: all 0.2s;
  &:hover {
    background-color: ${({ $selected }) =>
      $selected ? "rgba(225, 149, 67, 1)" : "#f5f5f5"};
  }
`;
export const SubmitButton = styled.button`
  background-color: #e5e7eb;
  color: #555;
  font-weight: 600;
  padding: 14px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
  &:hover {
    background-color: #d1d5db;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
export const Preview = styled.img`
  margin-top: 12px;
  max-width: 280px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;
export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
`;

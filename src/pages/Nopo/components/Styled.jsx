import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  /* gap: 100px; */
  min-height: 100vh;
  padding-top: 88px;
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
  height: 2528px;
  opacity: 1;
  gap: 80px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  opacity: 1;
  gap: 8px;
`;

export const Label = styled.label`
  font-family: Pretendard Variable;
  font-weight: 700;
  font-size: 30px;
  line-height: 100%;
  margin-bottom: 16px;
`;

export const Required = styled.span`
  color: red;
`;

export const Desc = styled.p`
  font-family: Pretendard Variable;
  font-weight: 400;
  font-style: Regular;
  font-size: 15px;
  line-height: 100%;
  letter-spacing: 0%;
  color: rgba(79, 79, 79, 1);
`;

export const CategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 600px;
  height: 225px;
  opacity: 1;
  gap: 27px;
`;

export const CategoryButton = styled.button`
  width: 150px;
  height: 99px;
  opacity: 1;
  gap: 10px;
  border-radius: 20px;
  border-width: 1px;

  padding: 16px 32px;
  border: 1px solid rgba(186, 186, 186, 1);
  border-radius: 16px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${({ selected }) =>
    selected ? "rgba(225, 149, 67, 1)" : "#fff"};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  font-weight: ${({ selected }) => (selected ? "700" : "500")};
  box-shadow: ${({ selected }) =>
    selected ? "0px 2px 8px rgba(0, 0, 0, 0.25)" : "none"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ selected }) =>
      selected ? "rgba(225, 149, 67, 1)" : "#f5f5f5"};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #aaa;
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
  transition: all 0.2s ease;

  &:hover {
    background-color: #d1d5db;
  }
`;

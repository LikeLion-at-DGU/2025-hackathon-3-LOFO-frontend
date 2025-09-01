import styled from "styled-components";

export function DueDateField({ value, onChange, minDate, error }) {
  return (
    <Block>
      <BlockTitle>마감기간</BlockTitle>
      <Help>
        최종 콘텐츠 마감일을 선택해주세요. 입력한 기한을 바탕으로 AI가 3단계
        미션을 생성합니다.<br/> 각 미션 기한을 넘기면 자동으로 완료되니 유의하세요.
      </Help>

      <DateRow>
        <DateLabel htmlFor="due">날짜 선택</DateLabel>
        <DateInput
          id="due"
          type="date"
          value={value}
          min={minDate}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
        />
      </DateRow>

      {error && <FieldError>{error}</FieldError>}
    </Block>
  );
}

const Block = styled.div`
  border-radius: 12px;
  padding: 16px;
`;

const BlockTitle = styled.h2`
  font-size: 35px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #368FEF;
`;

const Help = styled.p`
  font-size: 18px;
  color: #333;
  margin: 12px 0 25px 0;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DateLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 18px;

  &::before {
    content: "📅";
    font-size: 16px;
  }
`;

const DateInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 18px;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }
`;

const FieldError = styled.p`
  color: #dc2626;
  font-size: 12px;
  margin-top: 8px;
`;

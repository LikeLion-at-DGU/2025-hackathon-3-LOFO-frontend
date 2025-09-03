import styled from "styled-components";

export function GoalField({ value, onChange, error }) {
  return (
    <Block>
      <BlockTitle>목표</BlockTitle>
      <Help>
        상인의 요청을 확인하고, 제작할 최종 콘텐츠의 목표를 입력하세요.<br/>
        구체적으로 작성할수록 AI가 더 정확한 미션을 만듭니다.
      </Help>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="목표를 8자 이상 구체적으로 적어주세요. (예: 젊은 고객층 유입을 위한 가게 소개 카드뉴스를 만들고 싶어.)"
        aria-invalid={!!error}
      />
      {/*error && <FieldError>{error}</FieldError>*/}
    </Block>
  );
}

const Block = styled.div`
  border-radius: 12px;
  padding: 16px;
  margin: 80px 60px 0 20px ;
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


const Textarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px 22px;
  border: 1px solid #d1d5db;
  border-radius: 20px;
  font-size: 16px;
  resize: none;
  line-height: 60px;

  &:focus {
    outline: none;
    border-color: #5c98ff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.25);
  }
`;

const FieldError = styled.p`
  color: #268ddc;
  font-size: 12px;
  margin-top: 8px;
`;

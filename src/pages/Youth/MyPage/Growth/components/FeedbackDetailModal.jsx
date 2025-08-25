import { useEffect } from "react";
import styled, { css } from "styled-components";
import { fetchFeedbackDetail } from "../../../../../apis/feedback";
import { useState } from "react";
import { X } from "lucide-react";

export default function FeedbackDetailModal({ open, outcomeId, onClose }) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !outcomeId) return;
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchFeedbackDetail(outcomeId);
        if (alive) setDetail(res);
      } catch (e) {
        if (alive) setError("피드백을 불러오지 못했어요.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [open, outcomeId]);

  if (!open) return null;

  // BE 응답 예시 대응(필드명이 달라도 안전하게 가드)
  const q1 = detail?.overall ?? detail?.q1 ?? detail?.overall_satisfaction;
  const q2 = detail?.reflection ?? detail?.q2 ?? detail?.requirement_fit;
  const q3 = detail?.applicability ?? detail?.q3 ?? detail?.usable_level;
  const comment = detail?.comment ?? detail?.memo ?? detail?.text ?? "";

  return (
    <Backdrop onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>피드백 확인 모달</Title>
          <CloseBtn onClick={onClose} aria-label="닫기"><X size={20} /></CloseBtn>
        </Header>

        {loading ? (
          <Body>불러오는 중…</Body>
        ) : error ? (
          <Body>{error}</Body>
        ) : (
          <>
            <Body>
              <Field>
                <Label>작업을 전반적으로 만족하시나요? <Req>*</Req></Label>
                <BadgeGroup>
                  <Badge $active={q1 === "만족"}>만족</Badge>
                  <Badge $active={q1 === "보통"}>보통</Badge>
                  <Badge $active={q1 === "불만족"}>불만족</Badge>
                </BadgeGroup>
              </Field>

              <Field>
                <Label>요청하신 내용이 잘 반영되었나요? <Req>*</Req></Label>
                <BadgeGroup>
                  <Badge $active={q2 === "충분함"}>충분함</Badge>
                  <Badge $active={q2 === "보통"}>보통</Badge>
                  <Badge $active={q2 === "부족함"}>부족함</Badge>
                </BadgeGroup>
              </Field>

              <Field>
                <Label>결과물을 실제로 활용할 수 있을 것 같나요? <Req>*</Req></Label>
                <BadgeGroup>
                  <Badge $active={q3 === "가능"}>가능</Badge>
                  <Badge $active={q3 === "어느정도 가능"}>어느정도 가능</Badge>
                  <Badge $active={q3 === "어려움"}>어려움</Badge>
                </BadgeGroup>
              </Field>

              <Field>
                <Label>자유롭게 후기를 작성해주세요. <Req>*</Req></Label>
                <Help>간단한 감사 인사나 개선 의견도 큰 도움이 됩니다.</Help>
                <CommentBox
                  readOnly
                  value={comment || "후기 내용이 없습니다."}
                  placeholder="후기 내용이 없습니다."
                />
              </Field>
            </Body>
            <Footer>
              <GhostBtn onClick={onClose}>닫기</GhostBtn>
            </Footer>
          </>
        )}
      </Dialog>
    </Backdrop>
  );
}

/* ===== styled ===== */
const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  display: grid; place-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  width: 360px;                /* ← 고정 폭 유지 */
  max-height: 80vh;            /* ← 전체 고정, 내부만 스크롤 */
  min-height: 550px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(0,0,0,0.3);
  display: grid;
  grid-template-rows: auto 1fr auto;  /* 헤더/본문/푸터 */
  overflow: hidden;
`;

const Header = styled.div`
  padding: 16px 18px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid #eee;
`;
const Title = styled.h3`font-size: 18px; font-weight: 700;`;
const CloseBtn = styled.button`
  border: 0; background: transparent; cursor: pointer; line-height: 0;
`;

const Body = styled.div`
  padding: 18px;
  overflow: auto;              /* ← 본문만 스크롤 */
`;
const Footer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex; justify-content: flex-end; gap: 8px;
`;

const Field = styled.div` & + & { margin-top: 18px; }`;
const Label = styled.div` font-weight: 700; margin-bottom: 10px; `;
const Req = styled.span` color: #ff4d4f; `;
const Help = styled.div` color:#6b7280; font-size:12px; margin-bottom: 8px; `;

const BadgeGroup = styled.div` display: flex; gap: 8px; `;
const Badge = styled.span`
  display: inline-flex; align-items: center; justify-content: center;
  padding: 8px 12px; border-radius: 10px; font-weight: 700;
  border: 1px solid #368FEF; background: #f5f9ff;
  ${p => p.$active && css`
    background: #4F46E5; color: #fff; border-color: #4F46E5;
  `}
`;

const CommentBox = styled.textarea`
  width: 100%;
  height: 110px;               /* ← 박스 높이 고정 */
  padding: 12px;
  border: 1px solid #d1d5db; border-radius: 12px;
  resize: none;
  overflow: auto;              /* 텍스트 길면 스크롤 */
  background: #fafafa;
`;

const GhostBtn = styled.button`
  padding: 10px 14px; border-radius: 10px;
  border: 1px solid #d1d5db; background: #fff; cursor: pointer;
`;

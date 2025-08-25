import styled from "styled-components";

export default function EmptyState({
  title = "아직 데이터가 없어요!",
  description,
  actionLabel,
  onAction,
  align = "right", // "left" | "center" | "right"
}) {
  return (
    <Wrap $align={align}>
      <Box>
        <Title>{title}</Title>
        {description && <Desc>{description}</Desc>}
        {actionLabel && (
          <CTA type="button" onClick={onAction}>
            {actionLabel}
          </CTA>
        )}
      </Box>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  justify-content: ${({ $align }) =>
    $align === "left" ? "flex-start" : $align === "right" ? "flex-end" : "center"};
  padding: 12px 0 16px;
`;

const Box = styled.div`
  max-width: 360px;
  text-align: center;
`;

const Title = styled.div`
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
`;

const Desc = styled.div`
  margin-top: 6px;
  color: #9ca3af;
  font-size: 13px;
`;

const CTA = styled.button`
  margin-top: 10px;
  height: 32px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid #e6e1ff;
  background: #fff;
  color: #6f4afe;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(111, 74, 254, 0.15);
  cursor: pointer;
`;

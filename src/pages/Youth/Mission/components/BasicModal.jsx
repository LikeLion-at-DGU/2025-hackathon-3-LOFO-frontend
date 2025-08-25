import styled from "styled-components";

export default function BasicModal({ open, title, desc, confirmText="확인", onClose, onConfirm }) {
  if (!open) return null;
  return (
    <Backdrop onClick={onClose}>
      <Dialog onClick={(e)=>e.stopPropagation()}>
        <Title>{title}</Title>
        {desc && <Desc>{desc}</Desc>}
        <Actions>
          <Button onClick={onClose}>확인</Button>
        </Actions>
      </Dialog>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: grid; place-items: center; z-index: 1000;
`;
const Dialog = styled.div`
  width: min(520px, 90vw);
  background: #fff; border-radius: 16px; padding: 60px 40px 50px 40px;
  box-shadow: 0 12px 40px rgba(0,0,0,.2);
  display: flex; flex-direction: column; align-items: center;
`;
const Title = styled.h3`font-size: 24px; font-weight: 800; margin: 4px 0 -10px;`;
const Desc = styled.p`font-size: 20px;color:#64748b; line-height:1; white-space: pre-line;`;
const Actions = styled.div`display:flex; gap:8px; justify-content: flex-end; margin-top: 26px;`;
const Button = styled.button`
  height: 36px; width: 120px; padding: 0 14px; border-radius: 20px; border:1px solid #e5e7eb; background:#368FEF;
  color:#fff; border-color:#3b82f6; font-size: 18px;
`;
/*const Primary = styled(Button)`background:#3b82f6; color:#fff; border-color:#3b82f6;`;*/

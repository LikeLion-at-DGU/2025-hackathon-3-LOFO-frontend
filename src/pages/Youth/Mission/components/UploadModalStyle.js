import styled from "styled-components";


export const ModalBackdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,.38);
  display: grid; place-items: center; z-index: 1000;
`;
export const ModalCard = styled.div`
  max-height: 615px; width: 400px; max-width: calc(100vw - 32px);
  background: #fff; border-radius: 14px; box-shadow: 0 12px 40px rgba(0,0,0,.18);
  padding: 18px; overflow: scroll;
  display: flex;
  padding: 40px 40px 50px 40px;
  flex-direction: column;
`;
export const ModalHeader = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  h3 { font-size:16px; font-weight:600; }
`;
export const CloseBtn = styled.button`
  border:0; background:transparent; font-size:20px; cursor:pointer; color:#6b7280;
  align-self: flex-start;
`;

export const Dropzone = styled.div`
    display:grid; place-items:center; text-align:center;
    padding: 18px 22px;
    align-self: stretch;
    border-radius: 20px;
    border: 1.5px dashed ${(p) => p.$t.border};
    margin: 6px 0; 
    background: ${(p) => p.$t.bg};
    position: relative;
    p { font-size:12px; color: ${(p) => p.$t.hint}; line-height: 0; }
`;
export const CloudIcon = styled.svg`
  width: 100px; height: 100px;
  color: ${(p) => p.$t.accent};
  /* 혹시 SVG가 자체 색을 고정해놨다면 아래로 덮어쓰기 */
  & * { stroke: currentColor !important; fill: none; }
`;
export const HiddenInput = styled.input`
  position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0);
`;
export const UploadChip = styled.span`
  display:inline-block; padding:6px 8px; border-radius:10px;
  background:${(p) => p.$t.chip}; color:#fff; font-weight:500; border:1px solid ${(p) => p.$t.border};
  font-size: 12px; width: 110px; margin-top: 8px;
  cursor:pointer;
`;
export const FileInfo = styled.div`
  font-size: 14px; color: #374151; word-break: break-all; padding: 10px; text-align: center;
`;
export const PreviewImg = styled.img`
  max-width: 100%; max-height: 100%; object-fit: contain;
`;
export const RemoveBtn = styled.button`
  position: absolute; top: 8px; right: 8px;
  width: 22px; height: 22px; line-height: 20px; text-align: center;
  border-radius: 999px; border: 1px solid ${(p)=>p.$t.border};
  background: #fff; color: ${(p)=>p.$t.accent};
  font-weight: 800; cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,.06);
  padding: 0 2px;
`;

export const FieldLabel = styled.div`
  font-size:16px; font-weight:600; margin: 10px 0 6px; color:#374151;
`;
export const Footer = styled.div`display:flex; justify-content:center; margin-top: 14px;`;
export const Actions = styled.div`display:flex; justify-content:flex-start; margin: 6px 0 8px;`;
export const PrimaryBtn = styled.button`
  min-width: 140px; height: 36px; font-weight:550; cursor:pointer;
  background:#fff; color:${(p)=>p.$t.accent}; border:1px solid ${(p)=>p.$t.border};
  opacity:${p=>p.disabled?0.6:1};
  box-shadow: 0 4px 12px 0 ${(p)=>p.$t.shadow};
  border-radius: 100px;
  margin-top: 5px;

  &:disabled {
    /* 비활성화에도 옅은 그림자 유지하고 싶으면 */
    box-shadow: 0 4px 12px 0 ${(p)=>p.$t.disabledShadow};
  }
`;
export const SecondaryBtn = styled.button`
  margin: auto;
  height: 30px; border-radius: 999px; padding: 0 12px; font-weight:550; cursor:pointer;
  background:#fff; color:${(p)=>p.$t.accent}; border:1px solid ${(p)=>p.$t.border};
  box-shadow: 0 4px 12px 0 rgba(139, 111, 212, 0.50);
  margin: 10px auto;

  
`;
export const FeedbackBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 13px 24px;
    margin: 15px 0;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 15px;
    border: 1px solid ${(p) => p.$t.border};
    background: #FFF;
    font-size: 12px;
    .placeholder { color: #9ca3af; }
    ul { margin-top: 4px; padding-left: 18px; list-style: disc; }
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.25);
`;
export const PreviewWrapGrid = styled.div`
  width: 100%; display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; align-items: stretch;
`;
export const PreviewItem = styled.div`
  position: relative; height: 90px; border-radius: 10px; overflow: hidden;
  display: grid; place-items: center; background: #fff; border: 1px solid #e5e7eb;
`;

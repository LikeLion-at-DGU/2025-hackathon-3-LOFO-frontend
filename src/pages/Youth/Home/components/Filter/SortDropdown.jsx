//---------------폐기예정-------------------//

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { SORT_OPTIONS } from "../../../../../apis/filters"; // ← 단일 소스 사용

export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // 바깥 클릭 닫기
  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = SORT_OPTIONS.find(o => o.value === value) ?? SORT_OPTIONS[0];

  const handleSelect = (val) => {
    setOpen(false);
    if (val !== value) onChange?.(val);           // ★ 반드시 value("popular"/"latest")만 넘김
  };

  return (
    <Wrap ref={ref}>
      <Trigger
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label}
        <Chevron aria-hidden>▾</Chevron>
      </Trigger>

      {open && (
        <List role="listbox">
          {SORT_OPTIONS.map(opt => (
            <Item
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              $selected={opt.value === value}      // 선택 표시
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </Item>
          ))}
        </List>
      )}
    </Wrap>
  );
}

/* styled */
const Wrap = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 200px;
`;
const Trigger = styled.button`
  height: 36px; padding: 0 12px; border-radius: 8px;
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid #dbe2ea; background: #fff; cursor: pointer;
`;
const Chevron = styled.span`transform: translateY(-1px);`;
const List = styled.div`
  position: absolute; top: 44px; right: 0; width: 140px;
  background: #fff; border: 1px solid #e6e9ef; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.08); overflow: hidden; z-index: 10;
`;
const Item = styled.button`
  width: 100%; text-align: left; padding: 10px 12px; cursor: pointer; background: #fff; border: 0;
  &:hover {opacity: 0.5;}
  ${(p) => p.$selected && `background:#59418F; color: #fff; font-weight:600;`} /* 현재 선택 강조 */
`;

// src/pages/Youth/Home/components/SortDropdown.jsx
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "찜많은순", value: "popular" },
];

export default function SortDropdown({ value = "latest", onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = OPTIONS.find(o => o.value === value) ?? OPTIONS[0];

  return (
    <Wrap ref={ref}>
      <Trigger type="button" onClick={() => setOpen(v => !v)} aria-haspopup="listbox" aria-expanded={open}>
        {current.label}
        <Chevron aria-hidden>▾</Chevron>
      </Trigger>

      {open && (
        <List role="listbox">
          {OPTIONS.map(opt => (
            <Item
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => { onChange?.(opt.value); setOpen(false); }}
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
  &:hover { background: #f4f2ff; }
`;

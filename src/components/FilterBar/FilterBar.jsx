import styled from "styled-components";

export default function FilterBar({
  tabs = [],
  activeTab,
  onChangeTab,
  sortKey,
  onChangeSort,
  sortOpen,
  setSortOpen,
  sortRef,
}) {
  return (
    <TopRow>
      <Tabs>
        {tabs.map((t) => (
          <Tab
            key={t.key}
            $active={activeTab === t.key}
            onClick={() => onChangeTab(t.key)}
          >
            {t.label}
          </Tab>
        ))}
      </Tabs>

      <SortWrap ref={sortRef}>
        <SortButton onClick={() => setSortOpen((v) => !v)}>
          <span>{sortKey === "likes" ? "찜많은순" : "최신순"}</span>
          <Chevron />
        </SortButton>

        {sortOpen && (
          <SortMenu role="listbox">
            <SortItem
              role="option"
              aria-selected={sortKey === "latest"}
              $selected={sortKey === "latest"}
              onClick={() => {
                onChangeSort("latest");
                setSortOpen(false);
              }}
            >
              최신순
            </SortItem>
            <SortItem
              role="option"
              aria-selected={sortKey === "likes"}
              $selected={sortKey === "likes"}
              onClick={() => {
                onChangeSort("likes");
                setSortOpen(false);
              }}
            >
              찜많은순
            </SortItem>
          </SortMenu>
        )}
      </SortWrap>
    </TopRow>
  );
}

/* ---- styles ---- */
const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Tabs = styled.div`
  display: flex; gap: 20px; flex-wrap: wrap; padding: 12px 0 24px;
  display: inline-block;
`;
const Tab = styled.button`
  padding: 6px 24px;
  margin-right: 15px; 
  border-radius: 100px;
  border: 1px solid #ddd; 
  color: ${({ $active }) => ($active ? "#fff" : "#4F4F4F")};
  background: ${({ $active }) => ($active ? "#59418F" : "#ECECEC")};
  cursor: pointer;
  font-size: 13px; font-weight: 600;
`;
const SortWrap = styled.div`
  position: relative; margin-bottom: 15px;
`;
const SortButton = styled.button`
  height: 36px; padding: 0 12px; border-radius: 8px;
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid #dbe2ea; background: #fff; cursor: pointer;
`;
const Chevron = styled.span`
  width: 12px; height: 12px; display: inline-block;
  border-right: 3px solid #6b7280; border-bottom: 3px solid #6b7280;
  transform: rotate(-45deg); border-radius: 2px;
`;
const SortMenu = styled.div`
  position: absolute; top: 44px; right: 0; width: 140px;
  background: #fff; border: 1px solid #e6e9ef; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.08); overflow: hidden; z-index: 10;
`;
const SortItem = styled.button`
  width: 100%; text-align: left; padding: 10px 12px; cursor: pointer; background: #fff; border: 0;
  &:hover {opacity: 0.5;}
  ${(p) => p.$selected && `background:#59418F; color: #fff; font-weight:600;`}
`;

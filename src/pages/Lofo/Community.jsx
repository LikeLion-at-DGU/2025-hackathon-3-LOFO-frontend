import styled from "styled-components";
import * as S from "../Nopo/components/Styled";
import NopoTopnav from "../../components/Topnav/NopoTopnav";
import { YouthTopnav } from "../../components/Topnav/YouthTopnav";
import { HeadingContainer, Title, Subtitle } from "../Nopo/components/Heading";
import lofopick from "../../assets/lofopick.svg";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCommunityList, likeCommunity } from "../../apis/community";
import { useUserRole } from "../../hooks/useUserRole";

/* ---- 카테고리 탭 ---- */
const CATEGORY_TABS = [
  { key: "ALL", label: "전체" },
  { key: "PROMOTION_VIDEO", label: "홍보영상" },
  { key: "POSTER_FLYER", label: "포스터·전단" },
  { key: "SNS_IMAGE", label: "SNS 이미지" },
  { key: "INTERIOR_PROPOSAL", label: "인테리어 제안" },
  { key: "PROMOTION_PLANNING", label: "홍보기획" },
  { key: "AD_COPY", label: "광고문구" },
];

/* ---- localStorage 키 ---- */
const likedKey = (id) => `community:liked:${id}`;

export default function Community() {
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const [likedMap, setLikedMap] = useState({});
  const [activeTab, setActiveTab] = useState("ALL");

  // 정렬 상태
  const [sortKey, setSortKey] = useState("latest"); // 'latest' | 'likes'
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [liking, setLiking] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setListLoading(true);
        const { items } = await getCommunityList();
        setItems(items);
        const lm = {};
        items.forEach((it) => {
          if (localStorage.getItem(likedKey(it.id)) === "1") lm[it.id] = true;
        });
        setLikedMap(lm);
      } finally {
        setListLoading(false);
      }
    })();
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const onClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    if (sortOpen) document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [sortOpen]);

  // 탭 필터
  const filtered = useMemo(() => {
    if (activeTab === "ALL") return items;
    return items.filter(
      (x) =>
        String(x.category).toUpperCase() === activeTab ||
        x.categoryLabel ===
          CATEGORY_TABS.find((t) => t.key === activeTab)?.label
    );
  }, [items, activeTab]);

  // 정렬
  const filteredSorted = useMemo(() => {
    const arr = [...filtered];
    if (sortKey === "likes") {
      arr.sort((a, b) => (b.savedCount ?? 0) - (a.savedCount ?? 0));
    } else {
      // 최신순: createdAt desc → fallback id desc
      const time = (x) => {
        const t = Date.parse(x.createdAt || "");
        return Number.isFinite(t) ? t : 0;
      };
      arr.sort((a, b) => {
        const tb = time(b) - time(a);
        if (tb !== 0) return tb;
        return (b.id ?? 0) - (a.id ?? 0);
      });
    }
    return arr;
  }, [filtered, sortKey]);

  // 좋아요(+1, 한번만)
  const onLike = async (card) => {
    if (!isYouth) return;
    if (likedMap[card.id] || liking[card.id]) return;
    setLiking((m) => ({ ...m, [card.id]: true }));
    setItems((arr) =>
      arr.map((x) =>
        x.id === card.id ? { ...x, savedCount: (x.savedCount ?? 0) + 1 } : x
      )
    );
    try {
      const res = await likeCommunity(card.id);
      const serverCount = res?.saved_count ?? res?.likes;
      if (typeof serverCount === "number") {
        setItems((arr) =>
          arr.map((x) =>
            x.id === card.id ? { ...x, savedCount: serverCount } : x
          )
        );
      }
      localStorage.setItem(likedKey(card.id), "1");
      setLikedMap((m) => ({ ...m, [card.id]: true }));
    } catch (e) {
      console.error("[community:like] 실패", e?.response?.data || e);
      setItems((arr) =>
        arr.map((x) =>
          x.id === card.id
            ? { ...x, savedCount: Math.max(0, (x.savedCount ?? 1) - 1) }
            : x
        )
      );
      alert("좋아요 처리에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLiking((m) => ({ ...m, [card.id]: false }));
    }
  };

  //로그인 role 분류
  const {
    role,
    isYouth,
    isMerchant,
    loading: roleLoading,
  } = useUserRole({ verifyOnMount: false });

  //역할 값이 실제로 들어오는지 콘솔에서 확인
  useEffect(() => {
    console.log("[role]", {
      roleLoading,
      role,
      isYouth,
      isMerchant,
      ls: localStorage.getItem("role"),
    });
  }, [roleLoading, role, isYouth, isMerchant]);

  return (
    <S.Wrapper>
      {!roleLoading &&
        (isYouth ? <YouthTopnav /> : isMerchant ? <NopoTopnav /> : null)}

      <HeadingContainer>
        <Title>청년의 시선이 담긴 작업물, 한눈에 발견하세요</Title>
        <Subtitle>
          상인에게는 영감이, 청년에게는 성취가 되는 공간입니다.
        </Subtitle>
      </HeadingContainer>

      {/* 탭 + 정렬 드롭다운 */}
      <TopRow>
        <Tabs>
          {CATEGORY_TABS.map((t) => (
            <Tab
              key={t.key}
              $active={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
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
                  setSortKey("latest");
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
                  setSortKey("likes");
                  setSortOpen(false);
                }}
              >
                찜많은순
              </SortItem>
            </SortMenu>
          )}
        </SortWrap>
      </TopRow>

      {/* 카드 그리드 */}
      <CardGrid>
        {listLoading && <div style={{ color: "#6b7280" }}>불러오는 중…</div>}
        {!listLoading && filteredSorted.length === 0 && (
          <Empty>
            아직 공개된 작업물이 없어요. 곧 다양한 작품이 올라올 거예요!
          </Empty>
        )}
        {!listLoading &&
          filteredSorted.map((card) => (
            <Card key={card.id}>
              <Image $src={card.imageUrl} />
              <Gradient />

              {/* 호버 시만 노출되는 LOFO PICK (savedCount >= 10) */}
              {card.savedCount >= 10 && (
                <Badge>
                  <img src={lofopick} alt="LOFO PICK" />
                </Badge>
              )}

              <Content>
                <TitleLine title={card.title}>{card.title}</TitleLine>
                <StoreName>{card.storeName}</StoreName>
                {isYouth && (
                  <LikeRow>
                    <LikeButton
                      onClick={() => onLike(card)}
                      disabled={likedMap[card.id] || liking[card.id]}
                      aria-label="좋아요"
                      title={
                        likedMap[card.id]
                          ? "이미 좋아요를 눌렀어요"
                          : liking[card.id]
                          ? "처리 중…"
                          : "좋아요"
                      }
                    >
                      <Heart
                        size={18}
                        fill={likedMap[card.id] ? "#fff" : "transparent"}
                        stroke="#fff"
                      />
                    </LikeButton>
                    <LikeCount>{card.savedCount ?? 0}</LikeCount>
                  </LikeRow>
                )}
              </Content>
            </Card>
          ))}
      </CardGrid>
    </S.Wrapper>
  );
}

/* ---------------- styles ---------------- */

const TopnavPlaceholder = styled.div`
  height: 64px; /* Topnav 고정 높이에 맞춰 조정하세요 */
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 60px 0 60px;
  gap: 16px;
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const Tab = styled.button`
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  background: ${({ $active }) => ($active ? "#111827" : "#f3f4f6")};
  color: ${({ $active }) => ($active ? "#fff" : "#374151")};
  &:hover {
    background: ${({ $active }) => ($active ? "#0b1220" : "#e5e7eb")};
  }
`;

const SortWrap = styled.div`
  position: relative;
`;
const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid var(--sub-003, #59418f);
  background: #fff;
  color: #374151;
  font-weight: 800;
  cursor: pointer;
  min-width: 112px;
  justify-content: space-between;
  box-shadow: none; /* 고정 */
`;

const Chevron = styled.span`
  width: 18px;
  height: 18px;
  display: inline-block;
  border-right: 3px solid #6b7280;
  border-bottom: 3px solid #6b7280;
  transform: rotate(-45deg); /* 항상 아래 화살표 */
  border-radius: 2px;
`;
const SortMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 180px;
  background: #fff;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 20;
`;
const SortItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  font-weight: 800;
  font-size: 16px;
  border: none;
  background: ${({ $selected }) => ($selected ? "#5b3aa5" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#fff" : "#6b7280")};
  cursor: pointer;
  &:hover {
    background: ${({ $selected }) => ($selected ? "#5b3aa5" : "#f5f3ff")};
  }
`;
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 24px 60px 60px;
  width: 100%;
  max-width: 1440px;
`;
const Empty = styled.div`
  color: #6b7280;
  padding: 60px;
  grid-column: 1 / -1;
`;

const Card = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-6px);
  }
`;
const Image = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ $src }) =>
    `url(${
      $src || "https://via.placeholder.com/600x400"
    }) center/cover no-repeat`};
`;
const Gradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent 50%);
`;
const Content = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 12px;
  color: #fff;
`;
const TitleLine = styled.div`
  font-size: 16px;
  font-weight: 800;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const StoreName = styled.div`
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
`;
const LikeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
  margin-top: 6px;
`;
const LikeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  &:hover {
    transform: scale(1.1);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const LikeCount = styled.span`
  font-size: 14px;
`;
const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.18s ease, transform 0.18s ease;
  pointer-events: none;
  ${Card}:hover &,
  ${Card}:focus-within & {
    opacity: 1;
    transform: translateY(0);
  }
  img {
    width: 55px;
    display: block;
  }
`;

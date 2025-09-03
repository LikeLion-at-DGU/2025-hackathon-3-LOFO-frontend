import styled from "styled-components";
import * as S from "../Nopo/components/Styled";
import NopoTopnav from "../../components/Topnav/NopoTopnav";
import { YouthTopnav } from "../../components/Topnav/YouthTopnav";
import { HeadingContainer, Title, Subtitle } from "../Nopo/components/Heading";
import lofopick from "../../assets/lofopick.svg";
import { Heart } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCommunityList,
  likeCommunity,
  unlikeCommunity,
  getOutcomeFilesForPreview,
} from "../../apis/community";
import { useUserRole } from "../../hooks/useUserRole";

import Preview from "./Preview";

import logo_blue from "../../assets/logo_blue.svg";
import logo_nopo from "../../assets/logo_nopo.svg";
import logo from "../../assets/logo.svg";

/* ---- helpers ---- */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const addBase = (path = "") => {
  const clean = `/${String(path).replace(/^\/+/, "")}`;
  return API_BASE ? `${API_BASE}${clean}` : `/api${clean}`;
};
const isAbs = (u = "") =>
  /^https?:\/\//i.test(u) || String(u).startsWith("data:");
const isImageUrl = (u = "") => /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(u);
const logos = [logo_blue, logo_nopo, logo];
const hashInt = (s = "") => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};
const resolveCover = (item = {}) => {
  const fileUrls = Array.isArray(item.files)
    ? item.files
        .map((f) => f?.download_url || f?.url || f?.name)
        .filter(Boolean)
    : [];
  const candidates = [
    item.imageUrl,
    item.thumbnailUrl,
    item.thumbnail_url,
    item.firstImageUrl,
    ...fileUrls,
  ].filter(Boolean);
  let u = candidates.find((x) => isImageUrl(x));
  if (!u) return "";
  if (!isAbs(u)) {
    const mediaish = String(u).replace(/^\/?media\/?/, "media/");
    u = addBase(mediaish);
  }
  return u;
};

/* ---- 카테고리 탭 ---- */
const CATEGORY_TABS = [
  { key: "ALL", label: "전체" },
  { key: "POSTER_FLYER", label: "포스터·전단" },
  { key: "SNS_IMAGE", label: "SNS 이미지" },
  { key: "INTERIOR_PROPOSAL", label: "인테리어 제안" },
  { key: "PROMOTION_PLANNING", label: "홍보기획" },
  { key: "AD_COPY", label: "광고문구" },
];

/* ---- localStorage key ---- */
const likedKey = (id) => `community:liked:${id}`;

export default function Community() {
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  const [likedMap, setLikedMap] = useState({});
  const [activeTab, setActiveTab] = useState("ALL");

  // 정렬
  const [sortKey, setSortKey] = useState("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  const [liking, setLiking] = useState({});

  // 미리보기
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [previewMeta, setPreviewMeta] = useState({ title: "", storeName: "" });

  useEffect(() => {
    (async () => {
      setListLoading(true);
      try {
        const { items } = await getCommunityList();
        setItems(items);
        const lm = {};
        items.forEach((it) => {
          if (it.id && localStorage.getItem(likedKey(it.id)) === "1")
            lm[it.id] = true;
        });
        setLikedMap(lm);
      } catch (e) {
        console.error(
          "[community:list] error",
          e?.response?.status,
          e?.response?.data || e
        );
        setItems([]);
      } finally {
        setListLoading(false);
      }
    })();
  }, []);

  // 외부 클릭 시 정렬 닫기
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

  // 좋아요 토글
  const {
    role,
    isYouth,
    isMerchant,
    loading: roleLoading,
  } = useUserRole({ verifyOnMount: false });
  const onToggleLike = async (card) => {
    if (!isYouth || !card?.id) return;
    if (liking[card.id]) return;
    const isLiked = !!likedMap[card.id];
    setLiking((m) => ({ ...m, [card.id]: true }));
    setLikedMap((m) => ({ ...m, [card.id]: !isLiked }));
    setItems((arr) =>
      arr.map((x) =>
        x.id === card.id
          ? {
              ...x,
              savedCount: Math.max(
                0,
                (x.savedCount ?? 0) + (isLiked ? -1 : +1)
              ),
            }
          : x
      )
    );
    try {
      const api = isLiked ? unlikeCommunity : likeCommunity;
      const res = await api(card.id);
      const serverCount = res?.saved_count ?? res?.likes;
      if (typeof serverCount === "number") {
        setItems((arr) =>
          arr.map((x) =>
            x.id === card.id ? { ...x, savedCount: serverCount } : x
          )
        );
      }
      if (isLiked) localStorage.removeItem(likedKey(card.id));
      else localStorage.setItem(likedKey(card.id), "1");
    } catch (e) {
      console.error("[community:toggle-like] 실패", e?.response?.data || e);
      setLikedMap((m) => ({ ...m, [card.id]: isLiked }));
    } finally {
      setLiking((m) => ({ ...m, [card.id]: false }));
    }
  };

  // 프리뷰 열기
  const openPreview = async (card) => {
    try {
      let files = Array.isArray(card.files)
        ? card.files.map((f) => ({
            url: f.url || f.download_url || f.name,
            name: f.name,
            type: f.type || "image/*",
          }))
        : [];
      if ((!files || files.length === 0) && card.id) {
        const r = await getOutcomeFilesForPreview(card.id, card.imageUrl);
        files = r.files;
      }
      if ((!files || files.length === 0) && card.imageUrl) {
        files = [{ url: card.imageUrl, name: "thumbnail", type: "image/*" }];
      }
      if (!files || files.length === 0) {
        const rawId = String(card.id ?? card.title ?? "");
        const cover =
          resolveCover(card) || logos[hashInt(rawId) % logos.length];
        files = [{ url: cover, name: "cover", type: "image/*" }];
      }
      setPreviewFiles(files);
      setPreviewMeta({ title: card.title, storeName: card.storeName });
      setPreviewOpen(true);
    } catch (e) {
      console.error("[preview] 파일 로드 실패", e?.response?.data || e);
    }
  };
  const closePreview = () => setPreviewOpen(false);

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

      {/* ✅ 스티키 필터바 */}
      <StickyFilterBar>
        <BarInner>
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
            <SortButton
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              aria-expanded={sortOpen}
            >
              <span>{sortKey === "likes" ? "찜많은순" : "최신순"}</span>
              <Chevron />
            </SortButton>

            {sortOpen && (
              <SortMenu role="listbox">
                <SortItem
                  $selected={sortKey === "latest"}
                  onClick={() => {
                    setSortKey("latest");
                    setSortOpen(false);
                  }}
                >
                  최신순
                </SortItem>
                <SortItem
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
        </BarInner>
        <Divider />
      </StickyFilterBar>

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
            <Card
              key={card.id}
              onClick={() => openPreview(card)}
              style={{ cursor: "zoom-in" }}
            >
              <Image
                $src={
                  resolveCover(card) ||
                  logos[hashInt(String(card.id ?? "")) % logos.length]
                }
              />
              <Gradient />
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(card);
                      }}
                      disabled={liking[card.id]}
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

      <Preview
        isOpen={previewOpen}
        onClose={closePreview}
        files={previewFiles}
        title={previewMeta.title}
        storeName={previewMeta.storeName}
      />
    </S.Wrapper>
  );
}

/* ---------------- styles ---------------- */
const NAV_HEIGHT = 64; // Topnav 높이에 맞게 조정

const StickyFilterBar = styled.div`
  width: 100%;
  position: sticky;
  top: ${NAV_HEIGHT}px;
  z-index: 9;
  background: #fff; /* 필터바 영역 전체 흰색 */
`;

const BarInner = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 60px;
  max-width: 1440px;
  margin: 0 auto; */
  display: flex;
  align-items: center;
  justify-content: flex-start; /* ← 왼쪽 정렬 */
  gap: 16px;
  padding: 0 60px; /* 카드그리드와 좌우 여백 통일 */
  max-width: 1440px;
  margin: 0 auto;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb; /* 스크린샷처럼 연한 회색 라인 */
  margin-top: 12px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 12px 0 12px;
`;

const Tab = styled.button`
  padding: 6px 24px;
  border-radius: 100px;
  border: 1px solid #ddd;
  color: ${({ $active }) => ($active ? "#fff" : "#4F4F4F")};
  background: ${({ $active }) => ($active ? "#59418F" : "#ECECEC")};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
`;

const SortWrap = styled.div`
  position: relative;
  margin-left: auto; /* ← Tabs는 왼쪽, 정렬은 오른쪽 */
`;

const SortButton = styled.button`
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dbe2ea;
  background: #fff;
  cursor: pointer;
`;

const Chevron = styled.span`
  width: 12px;
  height: 12px;
  display: inline-block;
  border-right: 3px solid #6b7280;
  border-bottom: 3px solid #6b7280;
  transform: rotate(-45deg);
  border-radius: 2px;
`;

const SortMenu = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  width: 140px;
  background: #fff;
  border: 1px solid #e6e9ef;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 10;
`;

const SortItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  cursor: pointer;
  background: #fff;
  border: 0;

  &:hover {
    opacity: 0.5;
  }

  ${(p) =>
    p.$selected &&
    `
    background:#59418F;
    color: #fff;
    font-weight:600;
  `}
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
  ${Card}:hover &, ${Card}:focus-within & {
    opacity: 1;
    transform: translateY(0);
  }
  img {
    width: 55px;
    display: block;
  }
`;

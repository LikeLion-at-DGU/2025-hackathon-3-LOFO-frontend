// src/pages/Community/Community.jsx
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

// 🔽 새로 추가
import FilterBar from "../../components/FilterBar/FilterBar";
import {
  useCommunityFilter,
  DEFAULT_CATEGORY_TABS,
} from "../../hooks/useFilter";

const likedKey = (id) => `community:liked:${id}`;

export default function Community() {
  const [items, setItems] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [likedMap, setLikedMap] = useState({});
  const [liking, setLiking] = useState({});

  // 🔽 정렬 드롭다운 오픈 상태만 로컬(프레젠테이션용)
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // 🔽 훅 연결 (필터/정렬 + 결과)
  const {
    activeTab,
    setActiveTab,
    sortKey,
    setSortKey,
    filteredSorted,
    tabs,
  } = useCommunityFilter({
    items,
    tabs: DEFAULT_CATEGORY_TABS,
    initialTab: "ALL",
    initialSort: "latest",
  });

  useEffect(() => {
    (async () => {
      setListLoading(true);
      try {
        const { items } = await getCommunityList();
        setItems(items);

        // 로컬 likedMap 부팅
        const lm = {};
        items.forEach((it) => {
          if (it.id && localStorage.getItem(likedKey(it.id)) === "1")
            lm[it.id] = true;
        });
        setLikedMap(lm);
      } catch (e) {
        console.error("[community:list] error", e?.response?.status, e?.response?.data || e);
        setItems([]);
      } finally {
        setListLoading(false);
      }
    })();
  }, []);

  // 외부 클릭 시 정렬 드롭다운 닫기
  useEffect(() => {
    const onClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    if (sortOpen) document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [sortOpen]);

  // 좋아요 토글 (원본 그대로)
  const onToggleLike = async (card) => {
    // ... (당신 코드 그대로)
    if (liking[card.id]) return;
    const isLiked = !!likedMap[card.id];
    setLiking((m) => ({ ...m, [card.id]: true }));

    setLikedMap((m) => ({ ...m, [card.id]: !isLiked }));
    setItems((arr) =>
      arr.map((x) =>
        x.id === card.id
          ? { ...x, savedCount: Math.max(0, (x.savedCount ?? 0) + (isLiked ? -1 : +1)) }
          : x
      )
    );

    try {
      const api = isLiked ? unlikeCommunity : likeCommunity;
      const res = await api(card.id);
      const serverCount = res?.saved_count ?? res?.likes;
      if (typeof serverCount === "number") {
        setItems((arr) =>
          arr.map((x) => (x.id === card.id ? { ...x, savedCount: serverCount } : x))
        );
      }
      if (isLiked) localStorage.removeItem(likedKey(card.id));
      else localStorage.setItem(likedKey(card.id), "1");
    } catch (e) {
      console.error("[community:toggle-like] 실패", e?.response?.data || e);
      setLikedMap((m) => ({ ...m, [card.id]: isLiked }));
      setItems((arr) =>
        arr.map((x) =>
          x.id === card.id
            ? { ...x, savedCount: Math.max(0, (x.savedCount ?? 0) + (isLiked ? +1 : -1)) }
            : x
        )
      );
      alert(isLiked ? "좋아요 해제에 실패했어요. 잠시 후 다시 시도해 주세요." : "좋아요에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLiking((m) => ({ ...m, [card.id]: false }));
    }
  };

  // 미리보기 (원본 그대로)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [previewMeta, setPreviewMeta] = useState({ title: "", storeName: "" });

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
      if (!files || files.length === 0) return;

      setPreviewFiles(files);
      setPreviewMeta({ title: card.title, storeName: card.storeName });
      setPreviewOpen(true);
    } catch (e) {
      console.error("[preview] 파일 로드 실패", e?.response?.data || e);
    }
  };
  const closePreview = () => setPreviewOpen(false);

  const { role, isYouth, isMerchant, loading: roleLoading } = useUserRole({ verifyOnMount: false });

  return (
    <S.Wrapper>
      {!roleLoading && (isYouth ? <YouthTopnav /> : isMerchant ? <NopoTopnav /> : null)}

      <HeadingContainer>
        <Title>청년의 시선이 담긴 작업물, 한눈에 발견하세요</Title>
        <Subtitle>상인에게는 영감이, 청년에게는 성취가 되는 공간입니다.</Subtitle>
      </HeadingContainer>

      {/* 🔽 분리된 필터바 */}
      <FilterBar
        tabs={tabs}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        sortKey={sortKey}
        onChangeSort={setSortKey}
        sortOpen={sortOpen}
        setSortOpen={setSortOpen}
        sortRef={sortRef}
      />

      {/* 카드 그리드 */}
      <CardGrid>
        {listLoading && <div style={{ color: "#6b7280" }}>불러오는 중…</div>}
        {!listLoading && filteredSorted.length === 0 && (
          <Empty>아직 공개된 작업물이 없어요. 곧 다양한 작품이 올라올 거예요!</Empty>
        )}
        {!listLoading &&
          filteredSorted.map((card) => (
            <Card key={card.id} onClick={() => openPreview(card)} style={{ cursor: "zoom-in" }}>
              <Image $src={card.imageUrl} />
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
                      aria-label="좋아요"
                      title={
                        liking[card.id]
                          ? "처리 중…"
                          : // 아래 likedMap/state는 기존 그대로 사용
                            // 필요하면 props로 내려도 됨
                            "좋아요 토글"
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

/* ---- 아래 스타일은 기존 코드 그대로 두세요 ---- */
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
  &:hover { transform: translateY(-6px); }
`;
const Image = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ $src }) => `url(${ $src || "https://via.placeholder.com/600x400" }) center/cover no-repeat`};
`;
const Gradient = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%);
`;
const Content = styled.div`
  position: absolute; left: 16px; right: 16px; bottom: 12px; color: #fff;
`;
const TitleLine = styled.div`
  font-size: 16px; font-weight: 800; line-height: 1.25;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const StoreName = styled.div` margin-top: 4px; font-size: 12px; opacity: 0.9; `;
const LikeRow = styled.div` display: flex; align-items: center; gap: 6px; justify-content: flex-end; margin-top: 6px; `;
const LikeButton = styled.button`
  background: none; border: none; cursor: pointer; padding: 4px;
  &:hover { transform: scale(1.1); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const LikeCount = styled.span` font-size: 14px; `;
const Badge = styled.div`
  position: absolute; top: 12px; left: 12px; opacity: 0; transform: translateY(-4px);
  transition: opacity 0.18s ease, transform 0.18s ease; pointer-events: none;
  ${Card}:hover &, ${Card}:focus-within & { opacity: 1; transform: translateY(0); }
  img { width: 55px; display: block; }
`;

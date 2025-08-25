import styled from "styled-components";
import * as S from "../components/Styled";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReceivedList,
  oneClickDownloadOutcome,
} from "../../../apis/nopo_received";

import logo_blue from "../../../assets/logo_blue.svg";
import logo_nopo from "../../../assets/logo_nopo.svg";
import logo from "../../../assets/logo.svg";

/* ========= helpers ========= */
// dev 에서는 /api 프록시, 운영/스테이징에서는 절대 오리진 사용
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const addBase = (path = "") => {
  const clean = `/${String(path).replace(/^\/+/, "")}`;
  return API_BASE ? `${API_BASE}${clean}` : `/api${clean}`;
};
const isAbs = (u = "") =>
  /^https?:\/\//i.test(u) || String(u).startsWith("data:");
const isImageUrl = (u = "") => /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/i.test(u);

/** 카드 썸네일 URL 고르기 (여러 케이스 대응) */
const resolveThumb = (item = {}) => {
  const candidates = [
    item.thumbnailUrl,
    item.thumbnail_url,
    item.firstImageUrl,
    item.images?.[0],
    item.files?.find?.(
      (f) =>
        f?.kind?.toUpperCase() === "IMAGE" ||
        isImageUrl(f?.download_url || f?.name)
    )?.download_url,
  ].filter(Boolean);

  let u = candidates.find((x) => isImageUrl(x));
  if (!u) return ""; // 이미지 후보가 없으면 빈 값 반환 (로고 폴백 사용)

  // 상대경로면 /media/ 접두 포함해 정규화
  if (!isAbs(u)) {
    const mediaish = u.replace(/^\/?media\/?/, "media/");
    u = addBase(mediaish);
  }
  return u;
};
/* ========= /helpers ========= */

const ReceivedContainer = styled.div`
  display: flex;
  align-self: stretch;
  padding: 50px 60px;
  flex-direction: column;
  gap: 24px;
`;

/* 빈 상태 뷰 */
const EmptyBox = styled.div`
  margin-top: 40px;
  width: 100%;
  min-height: 320px;
  border-radius: 16px;
  background: #f7f7f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;
const CTAButton = styled.button`
  padding: 16px 28px;
  border-radius: 999px;
  border: none;
  background: #7c3aed;
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.35);
  transition: transform 0.05s ease, opacity 0.15s ease, background 0.15s ease;
  &:hover {
    background: #6d28d9;
  }
  &:active {
    transform: translateY(1px);
  }
`;

/* ===== 카드 + 버튼 UI ===== */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px 24px;
  width: 100%;
`;
const ItemWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Card = styled.div`
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;
const ThumbWrap = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
`;
const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/* 카드 전체를 덮는 검정 그라데이션 (0 → 0.7) */
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 14px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  color: #fff;
  pointer-events: none;
`;

const OvTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  line-height: 1.1;
`;
const OvStore = styled.div`
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.95;
`;

/* 카드 밖 컨트롤 버튼 */
const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;
const ReviewBtn = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--line-001, #bababa);
  color: #111827;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: background 0.15s ease, color 0.15s ease, transform 0.05s ease,
    border-color 0.15s ease;

  &:hover {
    background: var(--main-002, #e19543);
    color: #fff;
    border-color: transparent;
  }
  &:active {
    transform: translateY(1px);
  }
`;
const UseBtn = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 14px;
  background: #fff;
  border: 1px solid var(--line-001, #bababa);
  color: #111827;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: background 0.15s ease, transform 0.05s ease;

  &:hover {
    background: var(--main-002, #e19543);
    color: #fff;
    border-color: transparent;
  }
  &:active {
    transform: translateY(1px);
  }
`;

export default function Received() {
  const [items, setItems] = useState([]); // [{ outcomeId, title, storeName, thumbnailUrl, ... }]
  const [ongoingCount, setOngoingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getReceivedList();
        setItems(res.items);
        setOngoingCount(res.ongoingCount);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goCreate = () => navigate("/nopo/request/create");

  const handleFeedback = (outcomeId) => {
    navigate(`/nopo/received/feedback?id=${outcomeId}`);
  };

  const handleUse = async (outcomeId) => {
    try {
      await oneClickDownloadOutcome(outcomeId);
    } catch (e) {
      console.error("[활용하기] 다운로드 실패:", e);
      alert("다운로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer>
        <Title>내 가게에 {ongoingCount}명이 참여 중이에요</Title>
        <Subtitle>조금만 기다리면 작업물이 도착할 거예요!</Subtitle>
      </HeadingContainer>

      <ReceivedContainer>
        <Subtitle style={{ color: "#E19543" }}>
          내 가게를 도와준 청년들의 작업물 보기
        </Subtitle>

        {loading && <p style={{ color: "#6b7280" }}>불러오는 중…</p>}

        {!loading && items.length === 0 && (
          <EmptyBox>
            <div
              style={{ color: "#4b5563", textAlign: "center", lineHeight: 1.6 }}
            >
              아직 받은 작업물이 없어요.
              <br />
              지금 바로 청년들에게 도움을 요청해보세요!
            </div>
            <CTAButton onClick={goCreate}>요청 쓰러가기</CTAButton>
          </EmptyBox>
        )}

        {!loading && items.length > 0 && (
          <Grid>
            {items.map((v) => {
              const outcomeId = v.outcomeId ?? v.outcome_id ?? v.id;
              const title = v.title || "SNS 이미지";
              const storeName = v.storeName ?? v.store_name ?? "";

              // txt 전용 카드: outcomeId 기반 안정 랜덤 로고
              const logos = [logo_blue, logo_nopo, logo];
              const fallbackLogo =
                logos[(Number(outcomeId) || 0) % logos.length];

              // 이미지가 있으면 그걸, 없으면 로고를 썸네일로
              const cover = resolveThumb(v) || fallbackLogo;

              return (
                <ItemWrap key={outcomeId}>
                  <Card>
                    <ThumbWrap>
                      <ThumbImg
                        src={cover}
                        alt={title}
                        onError={(e) => {
                          e.currentTarget.src = fallbackLogo; // 이미지 실패 → 로고로 폴백
                        }}
                      />
                      <Overlay>
                        <div>
                          <OvTitle>{title}</OvTitle>
                          <OvStore>{storeName}</OvStore>
                        </div>
                      </Overlay>
                    </ThumbWrap>
                  </Card>

                  <Controls>
                    <ReviewBtn onClick={() => handleFeedback(outcomeId)}>
                      후기쓰기
                    </ReviewBtn>
                    <UseBtn onClick={() => handleUse(outcomeId)}>
                      활용하기
                    </UseBtn>
                  </Controls>
                </ItemWrap>
              );
            })}
          </Grid>
        )}
      </ReceivedContainer>
    </S.Wrapper>
  );
}

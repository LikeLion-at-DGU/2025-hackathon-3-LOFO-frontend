import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as S from "../components/Styled.js";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { Title, Subtitle } from "../components/Heading";
import { getRequestTabList, endRequest } from "../../../apis/nopo_request";

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 55px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
`;

const WriteButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 30px;
  background: #fff;
  color: #8b6fd4;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  &:hover {
    background: #f6f5ff;
  }
`;

const RightCTA = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  font-weight: 600;
`;

const HeaderRow = styled.div`
  display: flex;
  padding: 60px;
  align-items: center;
  justify-content: space-between;
  gap: 17px;
  flex-wrap: wrap;
  background: #fff;
  align-self: stretch;
`;
const HeadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 32px 0;
`;
const Tab = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: 0;
  font-weight: 500;
  cursor: pointer;
  background: ${({ $active }) => ($active ? " #DD7300" : "#f3f4f6")};
  color: ${({ $active }) => ($active ? "#fff" : "#6b7280")};
  &:hover {
    background: ${({ $active }) => ($active ? " #DD7300" : "#e5e7eb")};
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 36px 20px;
  max-width: 1200px;
  width: 100%;
  padding-bottom: 50px;
`;

/* === 카드 === */
const CardShell = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatusPill = styled.span`
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px 4px;
  background: ${({ $v }) =>
    $v === "모집중" ? "#7C3AED" : $v === "진행중" ? "#3B82F6" : "#374151"};
`;

/* 이미지 + 그라데이션 + 텍스트 오버레이 */
const CardFrame = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  &:hover ${"" /* 보라 오버레이만 페이드인 */} ${(props) => props.$hoverSel} {
    opacity: 1;
  }
`;

const CardMedia = styled.div`
  height: 180px;
  background: ${({ $src }) =>
    `url(${
      $src || "https://via.placeholder.com/640x360?text=%20"
    }) center/cover no-repeat`};
`;

/* 기본: 검정 그라데이션 */
const Shade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
`;
/* hover: 보라 그라데이션 */
const ShadeHover = styled(Shade)`
  background: linear-gradient(
    180deg,
    rgba(99, 34, 182, 0) 0%,
    rgba(99, 34, 182, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.25s ease;
`;

/* 하단 좌측 텍스트 */
const TextOverlay = styled.div`
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const TitleOver = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
`;
const StoreOver = styled.p`
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #e5e7eb;
`;

/* 카드 외부 메타(진행중 전용) */
const Meta = styled.div`
  margin-top: 10px;
`;
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
`;
const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;
const Progress = styled.div`
  width: ${({ $p }) => $p}%;
  height: 100%;
  background: #3b82f6;
`;
const DueText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: #6b7280;
`;

/* 모집중 액션 버튼(카드 바깥) */
const ActionsRow = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 12px;
`;
const ActionButton = styled.button`
  flex: 1;
  padding: 14px 0;
  border-radius: 16px;
  border: none;
  background: #fff;
  color: #111827;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  &:hover {
    transform: translateY(-1px);
  }
`;

const TABS = ["전체", "모집중", "진행중", "중단/종료"];

export default function Request() {
  const [activeTab, setActiveTab] = useState("전체");
  const [items, setItems] = useState([]);
  const [thumbCache, setThumbCache] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const jc = location.state?.justCreated;
    if (jc?.id && jc?.thumb)
      setThumbCache((m) => ({ ...m, [jc.id]: jc.thumb }));
  }, [location.state]);

  const load = async () => {
    setLoading(true);
    try {
      const { items } = await getRequestTabList();
      setItems(items);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "전체") return items;
    return items.filter((x) => x.status === activeTab);
  }, [items, activeTab]);

  const handleEdit = (item) =>
    navigate(`/nopo/request/edit/${item.id}`, { state: { item } });
  const handleEnd = async (id) => {
    await endRequest(id);
    await load();
  };

  return (
    <Wrapper>
      <NopoTopnav />
      <HeaderRow>
        <HeadText>
          <Title>가게에 필요한 도움, 여기서 관리하세요</Title>
          <Subtitle>
            여러 요청 작성 가능, 단 모집 종료 시 수정 불가합니다
          </Subtitle>
        </HeadText>
        <RightCTA>
          <span>청년의 도움이 필요한가요?</span>
          <WriteButton to="/nopo/request/create">요청 쓰러가기</WriteButton>
        </RightCTA>
      </HeaderRow>

      <TabContainer>
        {TABS.map((t) => (
          <Tab
            key={t}
            $active={activeTab === t}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </Tab>
        ))}
      </TabContainer>

      <CardGrid>
        {loading && <p style={{ color: "#6b7280" }}>불러오는 중…</p>}

        {!loading &&
          filtered.map((req) => {
            const hoverSel = ".shade-hover"; // 내부 선택자 문자열
            return (
              <CardShell key={req.id}>
                <StatusPill $v={req.status}>{req.status}</StatusPill>

                <CardFrame $hoverSel={hoverSel}>
                  <CardMedia $src={req.thumbnailUrl || thumbCache[req.id]} />
                  <Shade />
                  <ShadeHover className="shade-hover" />
                  <TextOverlay>
                    <TitleOver>{req.title}</TitleOver>
                    <StoreOver>{req.storeName}</StoreOver>
                  </TextOverlay>
                </CardFrame>

                {/* 진행률: 카드 밖으로 분리 */}
                {req.status === "진행중" && (
                  <Meta>
                    <MetaRow>
                      <span>진행률</span>
                    </MetaRow>
                    <ProgressBar>
                      <Progress $p={req.progress || 0} />
                    </ProgressBar>
                    <DueText>마감까지 D-00</DueText>
                  </Meta>
                )}

                {/* 모집중 전용 액션 */}
                {req.status === "모집중" && (
                  <ActionsRow>
                    <ActionButton onClick={() => handleEdit(req)}>
                      수정하기
                    </ActionButton>
                    <ActionButton onClick={() => handleEnd(req.id)}>
                      중단하기
                    </ActionButton>
                  </ActionsRow>
                )}
              </CardShell>
            );
          })}
      </CardGrid>
    </Wrapper>
  );
}

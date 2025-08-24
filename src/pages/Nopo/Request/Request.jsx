import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import * as S from "../components/Styled.js";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import { getRequestTabList, endRequest } from "../../../apis/nopo_request";

const WriteButton = styled(Link)`
  margin-left: auto;
  padding: 10px 20px;
  border-radius: 30px;
  background: #f3e8ff;
  color: #7c3aed;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  &:hover {
    background: #ede9fe;
  }
`;
const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 32px 0;
`;
const Tab = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#EA580C" : "#f3f4f6")};
  color: ${({ $active }) => ($active ? "#fff" : "#6b7280")};
  &:hover {
    background: ${({ $active }) => ($active ? "#EA580C" : "#e5e7eb")};
  }
`;
const CardGrid = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 100%;
`;
const Card = styled.div`
  width: 320px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;
const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background: ${({ $src }) =>
    `url(${
      $src || "https://via.placeholder.com/320x180"
    }) no-repeat center/cover`};
`;
const CardContent = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Status = styled.span`
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: ${({ $v }) =>
    $v === "모집중" ? "#7C3AED" : $v === "진행중" ? "#3B82F6" : "#6B7280"};
`;
const TitleText = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;
const StoreName = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
`;
const FooterButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
`;
const SmallButton = styled.button`
  flex: 1;
  padding: 12px 0;
  border-radius: 12px;
  border: none;
  background: #f3f4f6;
  color: #374151;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  &:hover {
    background: #e5e7eb;
  }
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

const TABS = ["전체", "모집중", "진행중", "중단/종료"];

export default function Request() {
  const [activeTab, setActiveTab] = useState("전체");
  const [items, setItems] = useState([]);
  const [thumbCache, setThumbCache] = useState({}); // { [id]: objectURL }
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 방금 생성한 카드의 임시 썸네일 캐시
  useEffect(() => {
    const jc = location.state?.justCreated;
    if (jc?.id && jc?.thumb) {
      setThumbCache((m) => ({ ...m, [jc.id]: jc.thumb }));
    }
  }, [location.state]);

  const load = async () => {
    setLoading(true);
    try {
      const { items } = await getRequestTabList(); // ✅ 전체 목록
      setItems(items);
      console.log("📦 Request tab loaded:", items.length, "items");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === "전체") return items;
    return items.filter((x) => x.status === activeTab); // status는 한글 라벨
  }, [items, activeTab]);

  const handleEdit = (item) =>
    navigate(`/nopo/request/edit/${item.id}`, { state: { item } });

  const handleEnd = async (id) => {
    await endRequest(id);
    await load();
  };

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer style={{ display: "flex", alignItems: "center" }}>
        <div>
          <Title>가게에 필요한 도움, 여기서 관리하세요</Title>
          <Subtitle>
            여러 요청 작성 가능, 단 모집 종료 시 수정 불가합니다
          </Subtitle>
        </div>
        <WriteButton to="/nopo/request/create">요청 쓰러가기</WriteButton>
      </HeadingContainer>

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
          filtered.map((req) => (
            <Card key={req.id}>
              <CardImage $src={req.thumbnailUrl || thumbCache[req.id]} />
              <CardContent>
                <Status $v={req.status}>{req.status}</Status>
                <TitleText>{req.title}</TitleText>
                <StoreName>{req.storeName}</StoreName>

                {req.status === "진행중" && (
                  <>
                    <ProgressBar>
                      <Progress $p={req.progress || 0} />
                    </ProgressBar>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                      마감까지 D-00
                    </p>
                  </>
                )}

                {req.status === "모집중" && (
                  <FooterButtons>
                    <SmallButton onClick={() => handleEdit(req)}>
                      수정하기
                    </SmallButton>
                    <SmallButton onClick={() => handleEnd(req.id)}>
                      중단하기
                    </SmallButton>
                  </FooterButtons>
                )}
              </CardContent>
            </Card>
          ))}
      </CardGrid>
    </S.Wrapper>
  );
}

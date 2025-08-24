// src/pages/Nopo/ReceivedFeedback.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import * as S from "../components/Styled";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getReceivedFormData,
  getOutcomeFiles, // 폼 데이터에 files가 없을 때 폴백
  postReceivedFeedback,
} from "../../../apis/nopo_received";

/* ---------- Viewer UI ---------- */
const ViewerWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 24px 0 40px;
`;
const ViewerBox = styled.div`
  position: relative;
  width: 640px;
  min-height: 360px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;
const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $left }) => ($left ? "left: -18px;" : "right: -18px;")}
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const Counter = styled.div`
  position: absolute;
  right: 14px;
  bottom: 10px;
  font-size: 12px;
  color: #6b7280;
  background: rgba(255, 255, 255, 0.85);
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #eee;
`;
const Img = styled.img`
  max-width: 100%;
  max-height: 480px;
  border-radius: 12px;
`;
const PdfFrame = styled.iframe`
  width: 100%;
  height: 480px;
  border: 0;
  border-radius: 12px;
`;
const FileName = styled.div`
  margin-top: 10px;
  text-align: center;
  color: #374151;
  font-size: 14px;
`;

export default function ReceivedFeedback() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const outcomeId = sp.get("id");

  // viewer state
  const [files, setFiles] = useState([]); // [{id, kind, name, size, url}]
  const [idx, setIdx] = useState(0);
  const active = files[idx];

  // 질문별 state
  const [satisfaction, setSatisfaction] = useState("");
  const [reflection, setReflection] = useState("");
  const [usability, setUsability] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 옵션
  const satisfactionOptions = [
    "매우 만족",
    "만족",
    "보통",
    "아쉬움",
    "매우 아쉬움",
  ];
  const reflectionOptions = [
    "매우 반영",
    "어느정도 반영",
    "보통",
    "부족함",
    "매우 부족함",
  ];
  const usabilityOptions = [
    "매우 가능",
    "어느정도 가능",
    "보통",
    "고민됨",
    "활용 어려움",
  ];

  // URL 헬퍼 (프리뷰/다운로드 공통)
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const isAbs = (u = "") =>
    /^https?:\/\//i.test(u) || String(u).startsWith("data:");
  const abs = (u = "") =>
    !u
      ? ""
      : isAbs(u)
      ? u
      : API_BASE
      ? new URL(u, API_BASE).toString()
      : `/api/${String(u).replace(/^\//, "")}`;
  const fileUrlOf = (f) =>
    abs(
      f?.download_url ||
        (f?.id
          ? `/nopo/received/file/${f.id}/download`
          : `/${String(f?.name || "").replace(/^\//, "")}`)
    );

  const isImage = (f) => {
    const n = (f?.name || "").toLowerCase();
    return (
      f?.kind?.toUpperCase() === "IMAGE" ||
      /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(n)
    );
  };
  const isPdf = (f) => {
    const n = (f?.name || "").toLowerCase();
    return f?.kind?.toUpperCase() === "PDF" || n.endsWith(".pdf");
  };

  // 폼 데이터 + 파일 로드
  useEffect(() => {
    if (!outcomeId) {
      setLoading(false);
      console.warn("[Feedback] outcome_id 누락 (?id=)");
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const data = await getReceivedFormData(outcomeId);
        console.log("[Feedback:form-data]", data);

        if (data?.defaults) {
          setSatisfaction(data.defaults.satisfaction ?? "");
          setReflection(data.defaults.reflection ?? "");
          setUsability(data.defaults.usability ?? "");
          setContent(data.defaults.content ?? "");
        }

        // 1) submit 응답에 files가 함께 온 경우 우선 사용
        let fileArr = data?.files || data?.outcome?.files || [];
        if (!Array.isArray(fileArr) || fileArr.length === 0) {
          // 2) 폴백: 별도 파일 목록 API
          const r = await getOutcomeFiles(outcomeId);
          fileArr = r?.files || [];
        }
        const normalized = (fileArr || []).map((f) => ({
          id: f.id,
          kind: f.kind,
          name: f.name,
          size: f.size,
          download_url: f.download_url,
          url: fileUrlOf(f),
        }));
        setFiles(normalized);
        setIdx(0);
      } catch (e) {
        console.error("[Feedback:load] 실패:", e?.response?.data || e);
      } finally {
        setLoading(false);
      }
    })();
  }, [outcomeId]);

  const isValid =
    !!outcomeId && satisfaction && reflection && usability && content.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    const payload = {
      outcome_id: outcomeId,
      satisfaction,
      reflection,
      usability,
      content,
    };
    console.log("[Feedback:submit] payload", payload);
    try {
      setSubmitting(true);
      await postReceivedFeedback(payload);
      alert("후기가 저장되었습니다.");
      navigate("/nopo/received");
    } catch (err) {
      console.error("[Feedback:submit] 실패:", err?.response?.data || err);
      alert("후기 저장에 실패했어요. 콘솔을 확인해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const onPrev = () =>
    setIdx((p) => (files.length ? (p - 1 + files.length) % files.length : 0));
  const onNext = () =>
    setIdx((p) => (files.length ? (p + 1) % files.length : 0));

  const activeViewer = useMemo(() => {
    if (!active) return null;
    if (isImage(active)) {
      return <Img src={active.url} alt={active.name || "preview"} />;
    }
    if (isPdf(active)) {
      // 일부 서버는 Content-Disposition: attachment 로 내려주면 inline 미표시 → 새 탭 열기 유도
      return (
        <PdfFrame
          src={active.url}
          title={active.name || "pdf"}
          onError={(e) => {
            // inline 실패 시 새 탭으로 열기
            window.open(active.url, "_blank", "noopener,noreferrer");
          }}
        />
      );
    }
    // 기타 파일은 새 탭으로
    return (
      <div style={{ textAlign: "center", color: "#6b7280" }}>
        미리보기를 지원하지 않는 형식입니다.{" "}
        <a href={active.url} target="_blank" rel="noreferrer">
          파일 열기
        </a>
      </div>
    );
  }, [active]);

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer>
        <Title>작업물을 확인하고 후기를 남겨주세요</Title>
        <Subtitle>
          청년이 전달한 결과물을 보고 마음에 든 점이나 개선할 점을 자유롭게
          작성해주시면 됩니다.
        </Subtitle>
      </HeadingContainer>
      {/* ===== 설문 폼 ===== */}
      <S.Form
        onSubmit={handleSubmit}
        // style={{ width: 800, marginTop: 40, opacity: loading ? 0.6 : 1 }}
      >
        <S.FormGroup>
          <S.Label>닉네임님이 만들어주신 작업물이에요.</S.Label>
          <S.Desc>
            요청 목적 외의 용도나 무단 사용은 삼가주세요.
            <br />
            청년에게 고마운 마음을 후기로 남겨주세요. 진심 어린 피드백이 큰 힘이
            됩니다.
          </S.Desc>
        </S.FormGroup>

        {/* ===== 업로드 파일 뷰어 ===== */}
        {files.length > 0 && (
          <>
            {/* <div style={{ width: 800, margin: "0 auto" }}>
            <h2 style={{ fontSize: 28, margin: "12px 0 8px" }}>
              닉네임님이 만들어주신 작업물이에요.
            </h2>
            <p style={{ color: "#6b7280", margin: 0 }}>
              요청 목적 외의 용도나 무단 사용은 삼가주세요. 청년에게 고마운
              마음을 후기로 남겨주세요.
            </p>
          </div> */}

            <ViewerWrap>
              <ViewerBox>
                {files.length > 1 && (
                  <ArrowBtn $left onClick={onPrev} aria-label="이전">
                    ‹
                  </ArrowBtn>
                )}
                {activeViewer}
                {files.length > 1 && (
                  <ArrowBtn onClick={onNext} aria-label="다음">
                    ›
                  </ArrowBtn>
                )}
                <Counter>
                  {idx + 1} / {files.length}
                </Counter>
              </ViewerBox>
            </ViewerWrap>

            <div
              style={{ width: 800, margin: "0 auto -8px", textAlign: "center" }}
            >
              <FileName>{(active?.name || "").split("/").pop()}</FileName>
            </div>
          </>
        )}
        {/* 1. 만족도 */}
        <S.FormGroup>
          <S.Label>
            작업물 전반적으로 만족하시나요?<S.Required>*</S.Required>
          </S.Label>
          <S.CategoryBox>
            {satisfactionOptions.map((option) => (
              <S.CategoryButton
                key={option}
                type="button"
                onClick={() => setSatisfaction(option)}
                $selected={satisfaction === option}
                disabled={loading || submitting}
              >
                {option}
              </S.CategoryButton>
            ))}
          </S.CategoryBox>
        </S.FormGroup>

        {/* 2. 요청 반영도 */}
        <S.FormGroup>
          <S.Label>
            요청하신 내용이 잘 반영되었나요?<S.Required>*</S.Required>
          </S.Label>
          <S.CategoryBox>
            {reflectionOptions.map((option) => (
              <S.CategoryButton
                key={option}
                type="button"
                onClick={() => setReflection(option)}
                $selected={reflection === option}
                disabled={loading || submitting}
              >
                {option}
              </S.CategoryButton>
            ))}
          </S.CategoryBox>
        </S.FormGroup>

        {/* 3. 활용 가능성 */}
        <S.FormGroup>
          <S.Label>
            결과물을 실제로 활용할 수 있을 것 같나요?<S.Required>*</S.Required>
          </S.Label>
          <S.CategoryBox>
            {usabilityOptions.map((option) => (
              <S.CategoryButton
                key={option}
                type="button"
                onClick={() => setUsability(option)}
                $selected={usability === option}
                disabled={loading || submitting}
              >
                {option}
              </S.CategoryButton>
            ))}
          </S.CategoryBox>
        </S.FormGroup>

        {/* 4. 자유 후기 */}
        <S.FormGroup>
          <S.Label>
            자유롭게 후기를 작성해주세요.<S.Required>*</S.Required>
          </S.Label>
          <S.Desc>간단한 감사 인사나 개선 의견도 큰 도움이 됩니다.</S.Desc>
          <S.Input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: 포스터 분위기가 가게 이미지랑 잘 맞아서 바로 활용할 수 있을 것 같아요."
            disabled={loading || submitting}
          />
        </S.FormGroup>

        <S.SubmitButton
          type="submit"
          disabled={!isValid || submitting || loading}
        >
          {submitting ? "전송 중..." : "전송하기"}
        </S.SubmitButton>

        {/* outcome_id 디버그 표시 */}
        <p style={{ marginTop: 12, color: "#6b7280", fontSize: 12 }}>
          outcome_id: {outcomeId || "(없음)"} — 상세 응답은 콘솔을 확인하세요.
        </p>
      </S.Form>
    </S.Wrapper>
  );
}

// import React, { useState } from "react";
// import styled from "styled-components";
// import * as S from "../components/Styled";
// import NopoTopnav from "../../../components/Topnav/NopoTopnav";
// import { HeadingContainer, Title, Subtitle } from "../components/Heading";

// const CategoryBox = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-between;
//   width: 800px;
//   height: 225px;
//   opacity: 1;
//   gap: 5px;
// `;

// const CategoryButton = styled.button`
//   width: 150px;
//   height: 99px;
//   opacity: 1;
//   gap: 10px;
//   border-radius: 20px;
//   border-width: 1px;

//   padding: 16px 20px;
//   border: 1px solid rgba(186, 186, 186, 1);
//   border-radius: 16px;
//   font-size: 16px;
//   cursor: pointer;
//   background-color: ${({ selected }) =>
//     selected ? "rgba(225, 149, 67, 1)" : "#fff"};
//   color: ${({ selected }) => (selected ? "#fff" : "#333")};
//   font-weight: ${({ selected }) => (selected ? "700" : "500")};
//   box-shadow: ${({ selected }) =>
//     selected ? "0px 2px 8px rgba(0, 0, 0, 0.25)" : "none"};
//   transition: all 0.2s ease;

//   &:hover {
//     background-color: ${({ selected }) =>
//       selected ? "rgba(225, 149, 67, 1)" : "#f5f5f5"};
//   }
// `;

// const ReceivedFeedback = () => {
//   // 질문별 state 분리
//   const [satisfaction, setSatisfaction] = useState("");
//   const [reflection, setReflection] = useState("");
//   const [usability, setUsability] = useState("");
//   const [content, setContent] = useState("");

//   const satisfactionOptions = [
//     "매우 만족",
//     "만족",
//     "보통",
//     "아쉬움",
//     "매우 아쉬움",
//   ];
//   const reflectionOptions = [
//     "매우 반영",
//     "어느정도 반영",
//     "보통",
//     "부족함",
//     "매우 부족함",
//   ];
//   const usabilityOptions = [
//     "매우 가능",
//     "어느정도 가능",
//     "보통",
//     "고민됨",
//     "활용 어려움",
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const feedbackData = {
//       satisfaction,
//       reflection,
//       usability,
//       content,
//     };
//     console.log("제출 데이터:", feedbackData);
//     // 👉 여기서 서버로 POST 요청 연결하면 됨
//   };

//   return (
//     <S.Wrapper>
//       <NopoTopnav />
//       <HeadingContainer>
//         <Title>작업물을 확인하고 후기를 남겨주세요</Title>
//         <Subtitle>
//           청년이 전달한 결과물을 보고 마음에 든 점이나 개선할 점을 자유롭게
//           작성해주시면 됩니다.
//         </Subtitle>
//       </HeadingContainer>

//       <S.Form
//         onSubmit={handleSubmit}
//         style={{ width: "800px", marginTop: "40px" }}
//       >
//         {/* 1. 만족도 */}
//         <S.FormGroup>
//           <S.Label>
//             작업물 전반적으로 만족하시나요?<S.Required>*</S.Required>
//           </S.Label>
//           <CategoryBox>
//             {satisfactionOptions.map((option) => (
//               <CategoryButton
//                 key={option}
//                 type="button"
//                 onClick={() => setSatisfaction(option)}
//                 selected={satisfaction === option}
//               >
//                 {option}
//               </CategoryButton>
//             ))}
//           </CategoryBox>
//         </S.FormGroup>

//         {/* 2. 요청 반영도 */}
//         <S.FormGroup>
//           <S.Label>
//             요청하신 내용이 잘 반영되었나요?<S.Required>*</S.Required>
//           </S.Label>
//           <CategoryBox>
//             {reflectionOptions.map((option) => (
//               <CategoryButton
//                 key={option}
//                 type="button"
//                 onClick={() => setReflection(option)}
//                 selected={reflection === option}
//               >
//                 {option}
//               </CategoryButton>
//             ))}
//           </CategoryBox>
//         </S.FormGroup>

//         {/* 3. 활용 가능성 */}
//         <S.FormGroup>
//           <S.Label>
//             결과물을 실제로 활용할 수 있을 것 같나요?<S.Required>*</S.Required>
//           </S.Label>
//           <CategoryBox>
//             {usabilityOptions.map((option) => (
//               <CategoryButton
//                 key={option}
//                 type="button"
//                 onClick={() => setUsability(option)}
//                 selected={usability === option}
//               >
//                 {option}
//               </CategoryButton>
//             ))}
//           </CategoryBox>
//         </S.FormGroup>

//         {/* 4. 자유 후기 */}
//         <S.FormGroup>
//           <S.Label>
//             자유롭게 후기를 작성해주세요.<S.Required>*</S.Required>
//           </S.Label>
//           <S.Desc>간단한 감사 인사나 개선 의견도 큰 도움이 됩니다.</S.Desc>
//           <S.Input
//             type="text"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="예: 신메뉴 출시 기념으로 사용할 전단지를 트렌디한 느낌 원해요."
//           />
//         </S.FormGroup>

//         {/* 전송 버튼 */}
//         <S.SubmitButton type="submit">전송하기</S.SubmitButton>
//       </S.Form>
//     </S.Wrapper>
//   );
// };

// export default ReceivedFeedback;

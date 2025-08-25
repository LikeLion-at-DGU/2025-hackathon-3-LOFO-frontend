import React, { useEffect, useMemo, useState, useRef } from "react";
import styled from "styled-components";
import * as S from "../components/Styled";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getReceivedFormData,
  getOutcomeFiles,
  postReceivedFeedback,
} from "../../../apis/nopo_received";

/* ===================== enum <-> label 매핑 ===================== */
/** 서버가 허용하는 값만 사용 */
const SAT_VALUE = {
  "매우 만족": "VERY_GOOD",
  만족: "GOOD",
  보통: "NORMAL",
  아쉬움: "BAD",
  "매우 아쉬움": "VERY_BAD",
};

/** REFLECTION: 서버 환경별로 허용값이 다를 수 있어 기본값 + 후보 준비 */
const REF_VALUE = {
  "매우 반영": "VERY_REFLECTED",
  "어느정도 반영": "REFLECTED", // 1차 시도값
  보통: "NORMAL",
  부족함: "INSUFFICIENT", // 1차 시도값
  "매우 부족함": "INSUFFICIENT", // VERY_* 없는 서버 대비
};

// 서버가 400으로 거부할 때 순차적으로 바꿔 시도할 후보들
const REF_FALLBACKS = {
  "어느정도 반영": ["SOMEWHAT_REFLECTED", "PARTLY_REFLECTED"],
  부족함: ["SOMEWHAT_INSUFFICIENT"],
  "매우 부족함": ["VERY_INSUFFICIENT"], // 어떤 서버는 이 값을 요구 가능
};

/** PRACTICAL_USE: SOMEWHAT_POSSIBLE 없음 */
const USE_VALUE = {
  "매우 가능": "VERY_POSSIBLE",
  "어느정도 가능": "POSSIBLE",
  보통: "NORMAL",
  고민됨: "HESITATE",
  "활용 어려움": "HARD_TO_USE",
};

/** 서버 value → 화면 라벨 (defaults 표시에 사용) */
const SAT_LABEL = Object.fromEntries(
  Object.entries(SAT_VALUE).map(([k, v]) => [v, k])
);
const REF_LABEL = Object.fromEntries(
  Object.entries(REF_VALUE).map(([k, v]) => [v, k])
);
const USE_LABEL = Object.fromEntries(
  Object.entries(USE_VALUE).map(([k, v]) => [v, k])
);

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
  background: transparent;
  border-radius: 16px;
  border: 2px dashed #e5e7eb;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
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
const TextBox = styled.pre`
  white-space: pre-wrap;
  font-size: 18px;
  line-height: 1.6;
  color: #111827;
  margin: 0;
  width: 100%;
`;

export default function ReceivedFeedback() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const outcomeId = sp.get("id");

  const touchX = useRef(null);

  // viewer state
  const [files, setFiles] = useState([]); // [{id, kind, name, size, url, txt_content?}]
  const [idx, setIdx] = useState(0);
  const active = files[idx];

  // 이미지/텍스트 준비
  const [imgSrc, setImgSrc] = useState("");
  const [imgTriedFallback, setImgTriedFallback] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [textLoading, setTextLoading] = useState(false);

  // 폼 state (라벨 보관)
  const [satisfaction, setSatisfaction] = useState("");
  const [reflection, setReflection] = useState("");
  const [usability, setUsability] = useState("");
  const [content, setContent] = useState(""); // 선택사항

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 옵션(라벨)
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

  // URL 헬퍼
  const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(
    /\/+$/,
    ""
  );
  const addBase = (path) =>
    API_BASE
      ? `${API_BASE}/${String(path).replace(/^\/+/, "")}`
      : `/api/${String(path).replace(/^\/+/, "")}`;
  const isAbs = (u = "") =>
    /^https?:\/\//i.test(u) || String(u).startsWith("data:");
  const fileUrlOf = (f) => {
    if (!f) return "";
    if (f.download_url && isAbs(f.download_url)) return f.download_url;
    if (f.name)
      return addBase(`media/${String(f.name).replace(/^\/?media\/?/, "")}`);
    if (f.id) return addBase(`nopo/received/file/${f.id}/download`);
    return "";
  };
  const isImage = (f) => {
    const s = (f?.name || f?.download_url || "").toLowerCase();
    return (
      f?.kind?.toUpperCase() === "IMAGE" ||
      /\.(png|jpe?g|gif|webp|bmp|svg)(\?|$)/.test(s)
    );
  };
  const isPdf = (f) => {
    const s = (f?.name || f?.download_url || "").toLowerCase();
    return f?.kind?.toUpperCase() === "PDF" || /\.pdf(\?|$)/.test(s);
  };
  const isText = (f) => {
    const s = (f?.name || f?.download_url || "").toLowerCase();
    return f?.kind?.toUpperCase() === "TEXT" || /\.txt(\?|$)/.test(s);
  };

  // 키보드/스와이프
  useEffect(() => {
    const onKey = (e) => {
      if (!files.length) return;
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [files.length]);
  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    dx > 0 ? onPrev() : onNext();
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

        // defaults → 라벨로 복원
        if (data?.defaults) {
          const d = data.defaults;
          const satLabel =
            d.overall_satisfaction?.label ??
            SAT_LABEL[d.overall_satisfaction?.value] ??
            SAT_LABEL[d.overall_satisfaction] ??
            d.satisfaction ??
            "";
          const refLabel =
            d.reflection_level?.label ??
            REF_LABEL[d.reflection_level?.value] ??
            REF_LABEL[d.reflection_level] ??
            d.reflection ??
            "";
          const useLabel =
            d.practical_use?.label ??
            USE_LABEL[d.practical_use?.value] ??
            USE_LABEL[d.practical_use] ??
            d.usability ??
            "";
          const comment = d.comment ?? d.content ?? "";
          setSatisfaction(satLabel || "");
          setReflection(refLabel || "");
          setUsability(useLabel || "");
          setContent(comment || "");
        }

        // 파일 정규화
        let fileArr = data?.files || data?.outcome?.files || [];

        if (
          (!Array.isArray(fileArr) || fileArr.length === 0) &&
          Array.isArray(data?.images) &&
          data.images.length > 0
        ) {
          fileArr = data.images.map((u, i) => ({
            id: null,
            kind: "IMAGE",
            name: u.includes("/media/") ? u.split("/media/")[1] : `image_${i}`,
            size: 0,
            download_url: u,
          }));
        }
        if (Array.isArray(data?.texts) && data.texts.length > 0) {
          const textFiles = data.texts.map((t, i) => {
            const isUrl = typeof t === "string" && /^https?:\/\//i.test(t);
            return {
              id: null,
              kind: "TEXT",
              name: isUrl
                ? t.includes("/media/")
                  ? t.split("/media/")[1]
                  : `text_${i}.txt`
                : `text_${i}.txt`,
              size: 0,
              download_url: isUrl ? t : null,
              txt_content: isUrl ? null : String(t),
            };
          });
          fileArr = [...fileArr, ...textFiles];
        }
        if (!Array.isArray(fileArr) || fileArr.length === 0) {
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
          txt_content: f.txt_content,
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

  // active 변경 시 미리보기 준비
  useEffect(() => {
    if (active && isImage(active)) {
      setImgSrc(active.url);
      setImgTriedFallback(false);
    }
    if (active && isText(active)) {
      if (active.txt_content != null) {
        setTextContent(String(active.txt_content));
        setTextLoading(false);
      } else {
        setTextLoading(true);
        fetch(active.url)
          .then((r) => r.text())
          .then((t) => setTextContent(t))
          .catch(() => setTextContent("텍스트 파일을 불러오지 못했습니다."))
          .finally(() => setTextLoading(false));
      }
    }
  }, [active?.url]);

  // 코멘트는 선택사항!
  const isValid = !!(outcomeId && satisfaction && reflection && usability);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    // payload 빌더
    const makePayload = (refOverride) => ({
      outcome_id: Number(outcomeId),
      overall_satisfaction: SAT_VALUE[satisfaction],
      reflection_level: refOverride ?? REF_VALUE[reflection],
      practical_use: USE_VALUE[usability],
      comment: (content || "").trim(),
    });

    let payload = makePayload(); // 1차 시도

    // 전송 전 매핑 검증
    for (const [k, v] of Object.entries({
      overall_satisfaction: payload.overall_satisfaction,
      reflection_level: payload.reflection_level,
      practical_use: payload.practical_use,
    })) {
      if (!v) {
        alert(
          "선택값 매핑에 실패했어요. 옵션 또는 매핑 테이블을 확인해 주세요."
        );
        return;
      }
    }

    console.log("[Feedback:submit] payload", payload);
    try {
      setSubmitting(true);
      await postReceivedFeedback(payload);
      alert("후기가 저장되었습니다.");
      navigate("/nopo/received");
    } catch (err1) {
      // reflection_level 때문에 400이면 후보값으로 자동 재시도
      const d1 = err1?.response?.data || {};
      const msg = d1?.reflection_level?.[0] || d1?.detail || "";
      const isInvalidReflection =
        /reflection_level/i.test(JSON.stringify(d1)) &&
        /유효하지 않은 선택|not a valid choice/i.test(String(msg));

      if (isInvalidReflection) {
        const candidates = REF_FALLBACKS[reflection] || [];
        for (const cand of candidates) {
          try {
            const retryPayload = makePayload(cand);
            console.log(
              "[Feedback:retry] reflection_level →",
              cand,
              retryPayload
            );
            await postReceivedFeedback(retryPayload);
            alert("후기가 저장되었습니다.");
            navigate("/nopo/received");
            return; // 성공
          } catch (err2) {
            console.warn(
              "[Feedback:retry:fail]",
              cand,
              err2?.response?.data || err2
            );
          }
        }
      }

      // 최종 실패 안내
      console.error("[Feedback:submit] 실패:", d1 || err1);
      const pick = (k) => (Array.isArray(d1[k]) ? d1[k][0] : d1[k]);
      alert(
        pick("detail") ||
          pick("outcome_id") ||
          pick("overall_satisfaction") ||
          pick("reflection_level") ||
          pick("practical_use") ||
          pick("comment") ||
          "후기 저장에 실패했어요. 콘솔을 확인해 주세요."
      );
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

    if (isText(active)) {
      return (
        <TextBox>
          {textLoading ? "불러오는 중…" : textContent || "내용이 없습니다."}
        </TextBox>
      );
    }
    if (isImage(active)) {
      return (
        <Img
          src={imgSrc || active.url}
          alt={active.name || "preview"}
          onError={(e) => {
            if (imgTriedFallback) return;
            let next = "";
            if (/\/media\//.test(e.currentTarget.src) && active.id)
              next = addBase(`nopo/received/file/${active.id}/download`);
            else if (active.name)
              next = addBase(
                `media/${String(active.name).replace(/^\/?media\/?/, "")}`
              );
            if (next && next !== e.currentTarget.src) {
              setImgTriedFallback(true);
              setImgSrc(next);
            }
          }}
        />
      );
    }
    if (isPdf(active)) {
      return (
        <PdfFrame
          src={active.url}
          title={active.name || "pdf"}
          onError={() =>
            window.open(active.url, "_blank", "noopener,noreferrer")
          }
        />
      );
    }
    return (
      <div style={{ textAlign: "center", color: "#6b7280" }}>
        미리보기를 지원하지 않는 형식입니다.{" "}
        <a href={active.url} target="_blank" rel="noreferrer">
          파일 열기
        </a>
      </div>
    );
  }, [active, imgSrc, imgTriedFallback, textLoading, textContent]);

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

      <S.Form onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label>닉네임님이 만들어주신 작업물이에요.</S.Label>
          <S.Desc>
            요청 목적 외의 용도나 무단 사용은 삼가주세요.
            <br />
            청년에게 고마운 마음을 후기로 남겨주세요. 진심 어린 피드백이 큰 힘이
            됩니다.
          </S.Desc>
        </S.FormGroup>

        {files.length > 0 && (
          <>
            <ViewerWrap>
              <ViewerBox onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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

        {/* 4. 자유 후기 (선택) */}
        <S.FormGroup>
          <S.Label>자유롭게 후기를 작성해주세요.</S.Label>
          <S.Desc>
            간단한 감사 인사나 개선 의견도 큰 도움이 됩니다. (선택)
          </S.Desc>
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
      </S.Form>
    </S.Wrapper>
  );
}

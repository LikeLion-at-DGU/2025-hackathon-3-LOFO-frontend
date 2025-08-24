import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import * as S from "../components/Styled.js";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import {
  getRequestDetail,
  updateRequest,
  getRequestTabList,
} from "../../../apis/nopo_request";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* ================== styled ================== */

const Banner = styled.div`
  width: 800px;
  padding: 12px 16px;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #9a3412;
  border-radius: 10px;
  font-size: 14px;
`;
const Inline = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

/* ================== helpers ================== */
const toKRStatus = (s = "") => {
  const u = String(s).toUpperCase();
  if (u === "OPEN") return "모집중";
  if (u === "ONGOING" || u === "IN_PROGRESS") return "진행중";
  if (u === "CLOSED") return "중단/종료";
  return "모집중";
};
const isFilled = (v) =>
  v !== undefined && v !== null && String(v).trim() !== "";

/* local cache (세션) — 등록 직후 값 보존용 */
const keyOf = (id) => `nopo:request:${id}`;
const loadCache = (id) => {
  try {
    return JSON.parse(sessionStorage.getItem(keyOf(id)) || "null");
  } catch {
    return null;
  }
};
const saveCache = (id, obj) => {
  try {
    sessionStorage.setItem(keyOf(id), JSON.stringify(obj));
  } catch {
    /* ignore */
  }
};

export default function RequestEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromList = location.state?.item;

  // 폼 상태
  const [storeName, setStoreName] = useState("");
  const [title, setTitle] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // 한글 라벨
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(""); // 기존 썸네일 or 새 선택
  const [imageDirty, setImageDirty] = useState(false); // 새 이미지로 바뀌었는지
  const fileInputRef = useRef(null); // 숨긴 input 제어
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [statusKR, setStatusKR] = useState("모집중");

  // // 이미지 변경 토글 (기본: 유지)
  // const [changeImage, setChangeImage] = useState(false);

  // UI 카테고리(라벨)
  const categories = [
    "포스터·전단",
    "SNS 이미지",
    "인테리어 제안",
    "홍보기획",
    "광고문구",
  ];

  // enum ↔ 라벨
  const enumToKR = useMemo(
    () => ({
      POSTER_FLYER: "포스터·전단",
      SNS_IMAGE: "SNS 이미지",
      PROMOTION_PLANNING: "홍보기획",
      AD_COPY: "광고문구",
      INTERIOR_PROPOSAL: "인테리어 제안",
    }),
    []
  );
  const krToEnum = useMemo(
    () => ({
      "포스터·전단": "POSTER_FLYER",
      "SNS 이미지": "SNS_IMAGE",
      홍보기획: "PROMOTION_PLANNING",
      광고문구: "AD_COPY",
      "인테리어 제안": "INTERIOR_PROPOSAL",
    }),
    []
  );
  const toKRCategory = (val) => {
    if (!isFilled(val)) return "";
    const up = String(val).toUpperCase();
    return enumToKR[up] || String(val); // 이미 한글 라벨이면 그대로
  };

  // 유효성
  const isUrl = (v = "") => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  };
  const isValid =
    storeName && title && isUrl(storeLink) && selectedCategory && content;
  const isEditable = statusKR === "모집중";

  // 프리필 로딩: cache → state(from list) → 목록 fallback → (가능하면) detail
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let acc = {
          storeName: "",
          title: "",
          url: "",
          content: "",
          categoryKR: "",
          preview: "",
          statusKR: "모집중",
        };

        // 1) session cache
        const cached = loadCache(id);
        if (cached) {
          acc.storeName = isFilled(acc.storeName)
            ? acc.storeName
            : cached.store_name || cached.storeName || "";
          acc.title = isFilled(acc.title) ? acc.title : cached.title || "";
          acc.url = isFilled(acc.url)
            ? acc.url
            : cached.url || cached.store_link || "";
          acc.content = isFilled(acc.content)
            ? acc.content
            : cached.content || "";
          acc.categoryKR = isFilled(acc.categoryKR)
            ? acc.categoryKR
            : toKRCategory(cached.category || cached.category_label);
        }

        // 2) state from list
        const s = fromList || null;
        if (s) {
          acc.storeName = isFilled(acc.storeName)
            ? acc.storeName
            : s.store_name || s.storeName || "";
          acc.title = isFilled(acc.title) ? acc.title : s.title || "";
          acc.url = isFilled(acc.url) ? acc.url : s.url || "";
          acc.content = isFilled(acc.content) ? acc.content : s.content || "";
          acc.categoryKR = isFilled(acc.categoryKR)
            ? acc.categoryKR
            : toKRCategory(s.category || s.category_label);
          acc.preview = isFilled(acc.preview)
            ? acc.preview
            : s.thumbnailUrl || s.image_url || s.image || "";
          acc.statusKR = isFilled(acc.statusKR)
            ? acc.statusKR
            : s.status_label || toKRStatus(s.status);
        }

        // 3) 목록 fallback (상세 GET이 없어서)
        if (!s) {
          const { items } = await getRequestTabList();
          const found = items.find((x) => String(x.id) === String(id));
          if (found) {
            acc.storeName = isFilled(acc.storeName)
              ? acc.storeName
              : found.store_name || found.storeName || "";
            acc.title = isFilled(acc.title) ? acc.title : found.title || "";
            acc.url = isFilled(acc.url) ? acc.url : found.url || "";
            acc.content = isFilled(acc.content)
              ? acc.content
              : found.content || "";
            acc.categoryKR = isFilled(acc.categoryKR)
              ? acc.categoryKR
              : toKRCategory(found.category || found.category_label);
            acc.preview = isFilled(acc.preview)
              ? acc.preview
              : found.thumbnailUrl || found.image_url || found.image || "";
            acc.statusKR = isFilled(acc.statusKR)
              ? acc.statusKR
              : found.status_label || toKRStatus(found.status);
          }
        }

        // 4) (가능하면) detail – 내부 구현이 목록 fallback일 수도 있음
        try {
          const detail = await getRequestDetail(id);
          if (detail) {
            acc.storeName = isFilled(acc.storeName)
              ? acc.storeName
              : detail.store_name || detail.storeName || "";
            acc.title = isFilled(acc.title) ? acc.title : detail.title || "";
            acc.url = isFilled(acc.url)
              ? acc.url
              : detail.url || detail.link || "";
            acc.content = isFilled(acc.content)
              ? acc.content
              : detail.content || detail.description || "";
            acc.categoryKR = isFilled(acc.categoryKR)
              ? acc.categoryKR
              : toKRCategory(detail.category || detail.category_label);
            acc.preview = isFilled(acc.preview)
              ? acc.preview
              : detail.thumbnailUrl || detail.image_url || detail.image || "";
            acc.statusKR = isFilled(acc.statusKR)
              ? acc.statusKR
              : detail.status_label || toKRStatus(detail.status);
          }
        } catch (_) {
          /* ignore */
        }

        // 상태 반영
        setStoreName(acc.storeName);
        setTitle(acc.title);
        setStoreLink(acc.url);
        setContent(acc.content);
        setSelectedCategory(acc.categoryKR);
        setPreviewUrl(acc.preview);
        setStatusKR(acc.statusKR || "모집중");

        console.log("[Edit:prefill]", { acc, cached, fromList: s });
      } catch (e) {
        console.error("[Edit:init] 프리필 실패:", e);
        setErrMsg("요청 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, fromList]);

  /* 이미지 */
  const onSelectFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setErrMsg("이미지는 5MB 이하만 업로드할 수 있어요.");
      return;
    }
    setErrMsg("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setImageDirty(true);
    e.target.value = ""; // 같은 파일 재선택 허용
  };

  /* 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setErrMsg("필수 항목을 모두 입력해 주세요.");
      return;
    }
    if (!isEditable) {
      setErrMsg("모집중 상태에서만 수정할 수 있어요.");
      return;
    }

    const categoryEnum =
      krToEnum[selectedCategory] || // 라벨이면 변환
      (enumToKR[String(selectedCategory).toUpperCase()]
        ? String(selectedCategory).toUpperCase()
        : null); // 이미 enum이면 그대로

    if (!categoryEnum) {
      setErrMsg("카테고리를 다시 선택해 주세요.");
      return;
    }

    const payload = {
      store_name: storeName,
      title,
      url: storeLink,
      category: categoryEnum,
      content,
      // 이미지 변경을 선택한 경우에만 전송
      ...(imageDirty && file ? { file } : {}),
    };
    console.log("[Edit:submit] payload:", payload, {
      changeImage,
      hasFile: !!file,
    });

    try {
      setLoading(true);
      await updateRequest(id, payload);

      // 최신값 캐시에 저장 (다음에 다시 들어와도 채워지도록)
      saveCache(id, {
        store_name: storeName,
        title,
        url: storeLink,
        category: categoryEnum,
        content,
      });

      navigate("/nopo/request", {
        replace: true,
        state: { justUpdated: { id, thumb: previewUrl || null } },
      });
    } catch (err) {
      console.error("[Edit:submit] ❌", err);
      setErrMsg(
        err?.response?.data?.message ||
          err?.message ||
          "수정 저장에 실패했어요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer>
        <Title>요청 내용을 수정하고 싶으신가요?</Title>
        <Subtitle>
          기존에 작성한 내용을 확인하고 필요한 부분을 고쳐주세요.
        </Subtitle>
      </HeadingContainer>

      {statusKR !== "모집중" && (
        <Banner>
          이 요청은 현재 <b>{statusKR}</b> 상태입니다. 정책상 모집중일 때만
          수정할 수 있어요.
        </Banner>
      )}

      <S.Form onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label>
            가게명을 입력해주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="예: 멋사노포"
            disabled={!isEditable || loading}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>
            요청 제목을 입력해주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 홍보기획"
            disabled={!isEditable || loading}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>가게 사진</S.Label>
          <S.Desc>기존 이미지를 유지하거나, 변경할 수 있어요.</S.Desc>

          <S.FileUpload
            style={{ marginTop: 12 }}
            role="button"
            tabIndex={0}
            onClick={() =>
              !loading && isEditable && fileInputRef.current?.click()
            }
            onKeyDown={(e) => {
              if (
                (e.key === "Enter" || e.key === " ") &&
                isEditable &&
                !loading
              ) {
                fileInputRef.current?.click();
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              hidden
              disabled={!isEditable || loading}
            />

            {previewUrl ? (
              <>
                <S.Preview src={previewUrl} alt="가게 이미지" />
                <div style={{ marginTop: 8, color: "#64748b" }}>
                  {imageDirty
                    ? "새 이미지가 선택되었습니다."
                    : "현재 이미지는 그대로 유지됩니다. 클릭하여 변경할 수 있어요."}
                </div>
              </>
            ) : (
              <>
                <span>이미지를 클릭해서 업로드하세요.</span>
              </>
            )}
          </S.FileUpload>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>
            가게 링크를 첨부해주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Desc>네이버 지도에 등록된 가게 링크를 입력해주세요.</S.Desc>
          <S.Input
            type="url"
            value={storeLink}
            onChange={(e) => setStoreLink(e.target.value)}
            placeholder="예: https://map.naver.com/..."
            disabled={!isEditable || loading}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>
            요청 카테고리를 선택해주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Desc>가장 알맞은 카테고리를 골라주세요.</S.Desc>
          <S.CategoryBox>
            {categories.map((c) => (
              <S.CategoryButton
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                $selected={selectedCategory === c}
                disabled={!isEditable || loading}
              >
                {c}
              </S.CategoryButton>
            ))}
          </S.CategoryBox>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>
            청년에게 부탁하고 싶은 내용을 적어주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Desc>구체적으로 적을수록 이해하기 쉬워요.</S.Desc>
          <S.Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: 신메뉴 출시 기념 전단지를 트렌디한 느낌으로 부탁드려요."
            disabled={!isEditable || loading}
          />
        </S.FormGroup>

        {errMsg && <p style={{ color: "#dc2626", fontSize: 14 }}>{errMsg}</p>}

        <S.SubmitButton
          type="submit"
          disabled={!isEditable || !isValid || loading}
        >
          {loading ? "저장 중..." : "수정 완료하기"}
        </S.SubmitButton>
      </S.Form>
    </S.Wrapper>
  );
}

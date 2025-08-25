import React, { useMemo, useState } from "react";
import styled from "styled-components";
import * as S from "../components/Styled.js";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import { createRequest } from "../../../apis/nopo_request";
import { useNavigate } from "react-router-dom";

export default function RequestCreate() {
  const navigate = useNavigate();

  // 기본 상태
  const [storeName, setStoreName] = useState("");
  const [title, setTitle] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [urlError, setUrlError] = useState("");

  // 제목 16자 제한
  const TITLE_MAX = 16;
  const [titleErr, setTitleErr] = useState("");
  const onChangeTitle = (e) => {
    const v = e.target.value;
    if (v.length > TITLE_MAX) {
      setTitle(v.slice(0, TITLE_MAX)); // 하드 컷
      setTitleErr(`제목은 최대 ${TITLE_MAX}자까지 입력할 수 있어요.`);
    } else {
      setTitle(v);
      setTitleErr("");
    }
  };

  const categories = [
    "포스터·전단",
    "SNS 이미지",
    "인테리어 제안",
    "홍보기획",
    "광고문구",
  ];
  const categoryMap = useMemo(
    () => ({
      "포스터·전단": "POSTER_FLYER",
      "SNS 이미지": "SNS_IMAGE",
      홍보기획: "PROMOTION_PLANNING",
      광고문구: "AD_COPY",
      "인테리어 제안": "INTERIOR_PROPOSAL",
    }),
    []
  );

  const isUrl = (v = "") => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  };

  const isValid =
    storeName &&
    title &&
    !titleErr &&
    isUrl(storeLink) &&
    selectedCategory &&
    content &&
    !!file;

  const onSelectFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) {
      setErrMsg("이미지는 20MB 이하만 업로드할 수 있어요.");
      return;
    }
    setErrMsg("");
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      setErrMsg("필수 항목을 모두 입력해 주세요.");
      return;
    }
    const categoryEnum = categoryMap[selectedCategory];
    if (!categoryEnum) {
      setErrMsg("카테고리를 다시 선택해 주세요.");
      return;
    }

    try {
      setLoading(true);
      setErrMsg("");
      const data = await createRequest({
        store_name: storeName,
        title,
        category: categoryEnum,
        url: storeLink,
        content,
        file,
      });

      const createdId =
        data?.id ??
        data?.request?.id ??
        data?.payload?.id ??
        data?.data?.id ??
        null;

      sessionStorage.setItem(
        `nopo:request:${createdId}`,
        JSON.stringify({
          store_name: storeName,
          title,
          url: storeLink,
          category: categoryEnum,
          content,
        })
      );
      navigate("/nopo/request", {
        state: { justCreated: { id: createdId, thumb: previewUrl || null } },
      });
    } catch (err) {
      console.error(err);
      setErrMsg(
        err?.response?.data?.message ||
          err?.message ||
          "요청 등록에 실패했어요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Wrapper>
      <NopoTopnav />
      <HeadingContainer>
        <Title>가게 고민을 청년과 함께 해결해보세요</Title>
        <Subtitle>
          요청은 청년이 지원하기 전까지만 수정할 수 있습니다.
          <br />
          지원이 시작되면 수정과 중단은 불가능합니다.
        </Subtitle>
      </HeadingContainer>

      <S.Form onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label>
            가게명을 입력해주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="예: 멋사노포"
            required
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>
            요청 제목을 입력해주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Input
            value={title}
            onChange={onChangeTitle}
            placeholder="예: 홍보기획"
            required
            aria-invalid={!!titleErr}
          />
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              lineHeight: 1.4,
              color: titleErr ? "#dc2626" : "#6b7280",
            }}
          >
            {titleErr || `${title.length}/${TITLE_MAX}자`}
          </div>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label>
            가게 사진을 올려주세요. <S.Required>*</S.Required>
          </S.Label>
          <S.Desc>요청과 관련된 사진 1장을 업로드해주세요.</S.Desc>
          <S.FileUpload>
            <input type="file" accept="image/*" onChange={onSelectFile} />
            {previewUrl && <S.Preview src={previewUrl} alt="미리보기" />}
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
            required
            onBlur={() =>
              setUrlError(isUrl(storeLink) ? "" : "올바른 URL 형식이 아닙니다.")
            }
          />
          {urlError && <S.ErrorText>{urlError}</S.ErrorText>}
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
            required
          />
        </S.FormGroup>

        {errMsg && <S.ErrorText>{errMsg}</S.ErrorText>}

        <S.SubmitButton type="submit" disabled={!isValid || loading}>
          {loading ? "등록 중..." : "요청 등록하기"}
        </S.SubmitButton>
      </S.Form>
    </S.Wrapper>
  );
}

import React, { useMemo, useState } from "react";
import styled from "styled-components";
import NopoTopnav from "../../../components/Topnav/NopoTopnav";
import { HeadingContainer, Title, Subtitle } from "../components/Heading";
import { createRequest } from "../../../apis/nopo_request";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-top: 88px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
  overflow-y: auto;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 80px;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 8px;
`;
const Label = styled.label`
  font-weight: 700;
  font-size: 30px;
  line-height: 100%;
  margin-bottom: 16px;
`;
const Required = styled.span`
  color: #ef4444;
`;
const Desc = styled.p`
  font-size: 15px;
  color: rgba(79, 79, 79, 1);
`;
const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  &::placeholder {
    color: #aaa;
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  &::placeholder {
    color: #aaa;
  }
`;
const FileUpload = styled.div`
  padding: 40px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background-color: #f0f6ff;
  text-align: center;
  font-size: 14px;
  color: #2563eb;
  input {
    cursor: pointer;
  }
`;
const CategoryBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 600px;
  gap: 27px;
`;
const CategoryButton = styled.button`
  width: 150px;
  height: 99px;
  border: 1px solid rgba(186, 186, 186, 1);
  border-radius: 16px;
  font-size: 16px;
  cursor: pointer;
  padding: 16px 32px;
  background-color: ${({ $selected }) =>
    $selected ? "rgba(225, 149, 67, 1)" : "#fff"};
  color: ${({ $selected }) => ($selected ? "#fff" : "#333")};
  font-weight: ${({ $selected }) => ($selected ? "700" : "500")};
  box-shadow: ${({ $selected }) =>
    $selected ? "0px 2px 8px rgba(0,0,0,0.25)" : "none"};
  transition: all 0.2s;
  &:hover {
    background-color: ${({ $selected }) =>
      $selected ? "rgba(225, 149, 67, 1)" : "#f5f5f5"};
  }
`;
const SubmitButton = styled.button`
  background-color: #e5e7eb;
  color: #555;
  font-weight: 600;
  padding: 14px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.2s;
  &:hover {
    background-color: #d1d5db;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
const Preview = styled.img`
  margin-top: 12px;
  max-width: 280px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;
const ErrorText = styled.p`
  color: #dc2626;
  font-size: 14px;
`;

export default function RequestCreate() {
  const navigate = useNavigate();
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

  const categories = [
    "홍보영상",
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
      홍보영상: "PROMOTION_VIDEO",
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
    isUrl(storeLink) &&
    selectedCategory &&
    content &&
    !!file;

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
    <Wrapper>
      <NopoTopnav />
      <HeadingContainer>
        <Title>가게 고민을 청년과 함께 해결해보세요</Title>
        <Subtitle>
          요청은 청년이 지원하기 전까지만 수정할 수 있습니다.
          <br />
          지원이 시작되면 수정과 중단은 불가능합니다.
        </Subtitle>
      </HeadingContainer>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            가게명을 입력해주세요. <Required>*</Required>
          </Label>
          <Input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="예: 멋사노포"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            요청 제목을 입력해주세요. <Required>*</Required>
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 홍보기획"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>
            가게 사진을 올려주세요. <Required>*</Required>
          </Label>
          <Desc>요청과 관련된 사진 1장을 업로드해주세요.</Desc>
          <FileUpload>
            <input type="file" accept="image/*" onChange={onSelectFile} />
            {previewUrl && <Preview src={previewUrl} alt="미리보기" />}
          </FileUpload>
        </FormGroup>

        <FormGroup>
          <Label>
            가게 링크를 첨부해주세요. <Required>*</Required>
          </Label>
          <Desc>네이버 지도에 등록된 가게 링크를 입력해주세요.</Desc>
          <Input
            type="url"
            value={storeLink}
            onChange={(e) => setStoreLink(e.target.value)}
            placeholder="예: https://map.naver.com/..."
            required
            onBlur={() =>
              setUrlError(isUrl(storeLink) ? "" : "올바른 URL 형식이 아닙니다.")
            }
          />
          {urlError && <ErrorText>{urlError}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>
            요청 카테고리를 선택해주세요. <Required>*</Required>
          </Label>
          <Desc>가장 알맞은 카테고리를 골라주세요.</Desc>
          <CategoryBox>
            {categories.map((c) => (
              <CategoryButton
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                $selected={selectedCategory === c}
              >
                {c}
              </CategoryButton>
            ))}
          </CategoryBox>
        </FormGroup>

        <FormGroup>
          <Label>
            청년에게 부탁하고 싶은 내용을 적어주세요. <Required>*</Required>
          </Label>
          <Desc>구체적으로 적을수록 이해하기 쉬워요.</Desc>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예: 신메뉴 출시 기념 전단지를 트렌디한 느낌으로 부탁드려요."
            required
          />
        </FormGroup>

        {errMsg && <ErrorText>{errMsg}</ErrorText>}

        <SubmitButton type="submit" disabled={!isValid || loading}>
          {loading ? "등록 중..." : "요청 등록하기"}
        </SubmitButton>
      </Form>
    </Wrapper>
  );
}

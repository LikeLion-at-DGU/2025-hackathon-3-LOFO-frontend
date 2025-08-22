import { instance } from "./instance";

//------------------------ 새 상인요청을 post로 생성합니다. ------------------------//

export async function createRequest({
  store_name,
  title,
  category,
  url,
  content,
  file,
}) {
  const formData = new FormData();
  formData.append("store_name", store_name);
  formData.append("title", title);
  formData.append("category", category);
  formData.append("url", url);
  formData.append("content", content);
  if (file) {
    formData.append("image", file);
  }

  const endpoint = "/nopo/request/create"

  try {
    const { data } = await instance.post(endpoint, formData);
    console.log("요청 등록 성공:", data);
    return data;
  } catch (error) {
    // 디버깅에 도움되게 상세 로그
    console.log("[createRequest] payload =", { store_name, title, category, url, content, file });
    console.error("요청 등록 실패:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
}

//------------------------ 작성된 상인요청을 patch로 수정합니다. ------------------------//
// "/nopo/request/<int:id>/edit"


//------------------------ 작성된 상인요청을 post로 종료합니다. ------------------------//
// "/nopo/request/<int:id>/end"

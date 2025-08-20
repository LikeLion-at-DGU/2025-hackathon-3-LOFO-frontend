import { instance } from "./instance";

// 새 요청 생성
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

  try {
    const { data } = await instance.post("/nopo/request/create", formData);
    console.log("요청 등록 성공:", data);
    return data;
  } catch (error) {
    console.error("요청 등록 실패:", error);
    throw error;
  }
}

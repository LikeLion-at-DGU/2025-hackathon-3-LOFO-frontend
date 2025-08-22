import { useEffect, useState } from "react";
import { fetchMyPortfolio } from "../apis/portfolio";

/** API 응답 → PostCard가 이해하는 형태로 normalize */
function normalize(item) {
  return {
    id: item.id,
    // PostCard가 name/title 둘 다 처리하니 둘 다 채워줌
    title: item.title,
    store_name: item.store_name,
    // 이미지 키 매핑
    image: item.cover_image_url,
    thumbnailUrl: item.cover_image_url,
    // 본문/부제는 응답에 없으니 가게명이나 카테고리 표기로 대체
    subtitle: item.category_display ?? item.store_name ?? "",
    // 좋아요(선택적으로 쓰일 수 있도록 보존)
    savedCount: item.like_count ?? 0,
    is_saved: item.is_liked ?? false,
    createdAt: item.created_at,
  };
}

export function usePortfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const raw = await fetchMyPortfolio();
        const normalized = raw.map(normalize);
        if (alive) setItems(normalized);
      } catch (e) {
        if (alive) setError(e?.response?.data?.message || e.message || "포트폴리오를 불러오지 못했어요.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { items, loading, error };
}

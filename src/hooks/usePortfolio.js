import { useEffect, useState } from "react";
import { fetchMyPortfolio } from "../apis/youthMypage";

/** API 응답 → PostCard가 이해하는 형태로 normalize */
function normalize(item = {}) {
  return {
    id: item.id,
    title: item.title ?? item.name ?? "",
    store_name: item.store_name ?? item.storeName ?? item.title ?? "",
    image: item.cover_image_url ?? item.thumbnail ?? item.image_url ?? "",
    thumbnailUrl: item.cover_image_url ?? item.thumbnail ?? item.image_url ?? "",
    subtitle: item.category_display ?? item.store_name ?? item.category ?? "",
    savedCount: item.like_count ?? item.saved_count ?? 0,
    is_saved: item.is_liked ?? item.savedByMe ?? false,
    createdAt: item.created_at ?? item.createdAt,
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
        console.log("[portfolio raw]", raw);

        if (!Array.isArray(raw)) throw new Error("응답이 배열이 아닙니다.");
        if (raw.length === 0) {
          console.warn("포트폴리오가 비어 있습니다. (계정/페이지 파라미터/응답키 확인)");
        }

        const normalized = raw.map(normalize);
        if (alive) setItems(normalized);
      } catch (e) {
        if (alive) {
          setError(e?.response?.data?.message || e.message || "포트폴리오를 불러오지 못했어요.");
        }
      } finally {
        if (alive) setLoading(false);        
      }
    })();
    return () => { alive = false; };
  }, []);


  
  return { items, loading, error };
}

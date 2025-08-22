import { useEffect, useMemo, useState } from "react";
import { getMySaved } from "../apis/youthMypage";

/**
 * 마이페이지 - 찜한 요청 / 좋아요 작품 불러오기 훅
 * - API 응답을 PostCard가 소비하기 좋은 형태로 매핑
 * - 첫 카드 CTA를 표시하고 싶으면 withCta=true
 */
export function useMySavedActivity({ withCta = true } = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedRequests, setSavedRequests] = useState([]);
  const [likedOutcomes, setLikedOutcomes] = useState([]);
  const [counts, setCounts] = useState({ saved: 0, liked: 0 });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getMySaved();
        if (!alive) return;

        setCounts({
          saved: data?.saved_requests_count ?? 0,
          liked: data?.liked_outcomes_count ?? 0,
        });

        const savedMapped =
          (data?.saved_requests ?? []).map((r) => ({
            id: r.id,
            store_name: r.store_name,
            title: r.title,
            image: r.image_url,
            content: r.category_label ?? r.status_label ?? "",
            is_saved: true,
            saved_count: r.saved_count ?? 0,
          })) ?? [];

        const likedMapped =
          (data?.liked_outcomes ?? []).map((o) => ({
            id: o.id,
            store_name: o.store_name,
            title: o.title,
            image: o.cover_image_url,
            content: o.category_display ?? "",
            is_saved: o.is_liked ?? false,
            saved_count: o.like_count ?? 0,
          })) ?? [];

        setSavedRequests(savedMapped);
        setLikedOutcomes(likedMapped);
      } catch (e) {
        console.error(e);
        setError(
          e?.response?.data?.message || "마이페이지 데이터를 불러오지 못했어요."
        );
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 첫 카드에만 CTA 플래그
  const savedWithCta = useMemo(() => {
    if (!withCta || savedRequests.length === 0) return savedRequests;
    return savedRequests.map((it, idx) => (idx === 0 ? { ...it, __cta: true } : it));
  }, [withCta, savedRequests]);

  return {
    loading,
    error,
    counts,
    savedRequests: savedWithCta,
    likedOutcomes,
    isEmptySaved: (counts.saved ?? 0) === 0,
    isEmptyLiked: (counts.liked ?? 0) === 0,
  };
}

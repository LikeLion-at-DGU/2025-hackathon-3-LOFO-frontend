import { useEffect, useState } from "react";

export function usePosts({ category="전체", page=1, pageSize=12 }) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      setLoading(true); setError(null);
      try {
        const base = import.meta.env.VITE_API_BASE_URL; // 배포/실서버용
        // 개발 중 프록시 쓸 거면 ↓ 주석 해제해서 사용:
        // const url = new URL("/api/missions", window.location.origin);

        // 실서버直요청이면 ↓ 사용(엔드포인트 맞게 수정)
        const url = new URL("/home", base); // 또는 "/home/missions" / "/api/missions"

        if (category && category !== "전체") url.searchParams.set("category", category);
        url.searchParams.set("page", String(page));
        url.searchParams.set("pageSize", String(pageSize));

        const res = await fetch(url.toString(), { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        setData({ items: json.items ?? [], total: json.total ?? 0 });
      } catch (e) {
        if (e.name !== "AbortError") setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
    return () => controller.abort();
  }, [category, page, pageSize]);

  return { ...data, loading, error };
}

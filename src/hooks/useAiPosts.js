import { useEffect, useState } from "react";
import { getAiPostList } from "../apis/home_post";

export function useAiPosts({ category="전체", sort = "latest", page=1, pageSize=12 }) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getAiPostList({ category, sort, page, pageSize });
        setData(result);
      } catch (e) {
        if (e.name !== "AbortError") setError(e);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [category, sort, page, pageSize]);

  return { ...data, loading, error };
}
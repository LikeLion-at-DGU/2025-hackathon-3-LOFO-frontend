import { useEffect, useState } from "react";
import { getPostList } from "../apis/nopo_request";

export function usePosts({ category="전체", sort = "latest", page=1, pageSize=12 }) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPostList({ category, sort, page, pageSize });
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
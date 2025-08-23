import { useEffect, useState, useCallback } from "react";
import { getMyMission } from "../apis/youth_Mission";

export function useMyMission() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetcher = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyMission(); // ⚠️ 선행 토큰 검사는 하지 않는다
      setData(res);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        setError(new Error("로그인이 필요합니다.")); // 서버가 실제로 401을 준 경우
      } else {
        setError(new Error(e?.message || "불러오기에 실패했습니다."));
      }
      console.log("useMyMission error:", status, e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetcher(); }, [fetcher]);

  return { data, loading, error, refetch: fetcher };
}

import { useEffect, useMemo, useState } from "react";
import { fetchGrowthInsights } from "../apis/youthMypage";

// utils
function formatPhone(v = "") {
  const d = (v || "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  if (d.length === 10) return d.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  return v || "";
}

function mapToVM(payload = {}) {
  const {
    nickname = "",
    phone_number = "",
    stats = {},
    feedbacks = [],
    nopo_pick_outcomes = [],
    logo_url,
  } = payload;

  const profile = {
    name: nickname || "로포",
    phone: formatPhone(phone_number),
    stats: {
      completed: Number(stats?.missions_done ?? 0),
      inProgress: Number(stats?.missions_in_progress ?? 0),
      picks: Number(stats?.nopo_pick_count ?? 0),
      total: Number(stats?.missions_total ?? 0),
    },
    logoUrl: logo_url,
  };

  const feedbackItems = (feedbacks || []).map((f, i) => ({
    id: f.outcome_id ?? i,
    text:
      (f.comment && f.comment.trim()) ||
      (f.summary_44 && String(f.summary_44).trim()) ||
      "(내용 없음)",
    meta: { store: f.store_name, createdAt: f.created_at },
  }));

  const pickItems = (nopo_pick_outcomes || []).map((p, i) => ({
    id: p.id ?? p.outcome_id ?? i,
    title: p.title ?? "제목 없음",
    subtitle: p.store_name ?? p.store ?? "",
    thumbnail:
      p.thumbnailUrl || p.thumbnail || p.image_url ||
      "https://placehold.co/600x400?text=LOFO+PICK",
  }));

  return { profile, feedbackItems, pickItems };
}

export function useGrowthInsights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ profile: null, feedbackItems: [], pickItems: [] });

  // fetch + abort
  const refetch = async (signal) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchGrowthInsights(); // axios는 signal 옵션이 별도지만 인스턴스에서 지원 안하면 생략
      setData(mapToVM(res));
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || e.message || "성장 지표를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const aborter = new AbortController();
    refetch(aborter.signal);
    return () => aborter.abort?.();
  }, []);

  // 파생 값들 메모
  const counts = useMemo(
    () => ({
      feedbacks: data.feedbackItems?.length ?? 0,
      picks: data.pickItems?.length ?? 0,
    }),
    [data.feedbackItems, data.pickItems]
  );

  return {
    loading,
    error,
    profile: data.profile,
    feedbacks: data.feedbackItems,
    picks: data.pickItems,
    counts,
    refetch,
  };
}

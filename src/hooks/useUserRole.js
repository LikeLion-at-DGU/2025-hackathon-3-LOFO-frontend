import { useCallback, useEffect, useMemo, useState } from "react";
import { instance } from "../apis/instance";

const ROLE_KEY = "role"; // "YOUTH" | "MERCHANT"

export function useUserRole({ verifyOnMount = true } = {}) {
  const [role, setRoleState] = useState(() => localStorage.getItem(ROLE_KEY));
  const [loading, setLoading] = useState(verifyOnMount);
  const [error, setError] = useState(null);

  // 내부 공용 setter: state + localStorage 동기화
  const setRole = useCallback((nextRole) => {
    setRoleState(nextRole);
    if (nextRole) localStorage.setItem(ROLE_KEY, nextRole);
    else localStorage.removeItem(ROLE_KEY);
  }, []);

  // 다른 탭에서 로그인/로그아웃 시 동기화
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ROLE_KEY) setRoleState(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 서버 검증: 세션 살아있으면 서버 역할로 교정, 아니면 role 비움
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await instance.get("/auth/me", {
        withCredentials: true,
      });
      const serverRole = data?.role;
      setRole(serverRole || null);
    } catch (e) {
      // 401/403/404 모두 세션 없음으로 간주
      setRole(null);
      setError(e);
      // console.debug("[useUserRole] /auth/me 실패", e?.response?.status);
    } finally {
      setLoading(false);
    }
  }, [setRole]);

  useEffect(() => {
    if (!verifyOnMount) {
      setLoading(false);
      return;
    }
    refresh();
  }, [verifyOnMount, refresh]);

  // 편의 함수: 로그인/로그아웃
  const loginYouth = useCallback(
    async (payload) => {
      await instance.post("/auth/login-youth", payload, {
        withCredentials: true,
      });
      setRole("YOUTH");
    },
    [setRole]
  );

  const loginMerchant = useCallback(
    async (payload) => {
      await instance.post("/auth/login-nopo", payload, {
        withCredentials: true,
      });
      // 백엔드 Role: MERCHANT
      setRole("MERCHANT");
    },
    [setRole]
  );

  const logout = useCallback(async () => {
    try {
      await instance.post("/auth/logout", {}, { withCredentials: true });
    } catch (_) {
    } finally {
      setRole(null);
    }
  }, [setRole]);

  const isYouth = role === "YOUTH";
  const isMerchant = role === "MERCHANT";

  return {
    role,
    isYouth,
    isMerchant,
    loading,
    error,

    setRole, // 수동 세팅(테스트/임시 전환용)
    refresh, // 서버 재검증
    loginYouth, // 청년 로그인
    loginMerchant, // 상인 로그인
    logout, // 로그아웃
  };
}

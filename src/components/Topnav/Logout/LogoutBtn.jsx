import * as S from "./Styled";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestLogout } from "../../../apis/auth";

export default function LogoutBtn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    setErrMsg("");

    try {
      await requestLogout();           // 서버에 로그아웃 요청 (쿠키 제거)
    } catch (err) {
      console.error(err);
      setErrMsg(
        err?.response?.data?.message || "서버 로그아웃 실패. 로컬 세션만 종료합니다."
      );
    } finally {
      // 클라이언트 세션 정리 (프로젝트에 맞게 조정)
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      sessionStorage.removeItem("signup_phone");
      // 전역 상태가 있다면: setUser(null) / dispatch({type:'LOGOUT'})
      navigate("/");
      setLoading(false);
    }
  };

  return (
    <>
      <S.Btn type="button" disabled={loading} onClick={handleLogout}>
        {loading ? "로그아웃 중..." : "로그아웃"}
      </S.Btn>
      {errMsg && (
        <span style={{ marginLeft: 12, color: "#ef4444", fontSize: 12 }}>
          {errMsg}
        </span>
      )}
    </>
  );
}
import * as S from "./Styled";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Topnav from "../../../components/Topnav/Topnav";
import InputField from "../../../components/SignUp/InputField";
import SubmitButton from "../../../components/SignUp/SubmitButton";
import { signupNopoByPhone } from "../../../apis/auth";
import { useUserRole } from "../../../hooks/useUserRole";

export default function NopoSignUp() {
  const navigate = useNavigate();
  const { setRole } = useUserRole({ verifyOnMount: false });
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // 숫자만, 최대 11자리
  const onlyDigits = (v) => v.replace(/\D/g, "");
  const onChangePhone = (e) =>
    setPhone(onlyDigits(e.target.value).slice(0, 11));

  // 010 포함 10~11자리
  const phoneValid = useMemo(() => /^0\d{9,10}$/.test(phone), [phone]);
  const isValid = phoneValid;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setErrMsg("");

    try {
      const data = await signupNopoByPhone({
        phone_num: phone,
      });
      console.log("응답:", data);

      if (data?.redirect) {
        setRole("MERCHANT");
        navigate(data.redirect);
      } else {
        navigate("/auth/login-nopo/nickname", { state: { phone } });
        sessionStorage.setItem("signup_phone", phone); // 새로고침 대비
      }
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "가입/로그인 처리 중 오류가 발생했어요.";
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Topnav />
      <S.Div>
        <S.Title>
          안녕하세요, LOFO와 함께
          <br />
          가게 손님을 모으는 작업물을 받아보세요
        </S.Title>
        <S.InputContainer>
          <S.Info>
            <S.InputTitle>전화번호 입력 </S.InputTitle>
            <S.InputDescription>
              1분만에 가입하고 가게 요청을 만들어보세요!
            </S.InputDescription>
          </S.Info>
          {/* Enter 제출 가능하도록 form 사용 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <S.InputWrap>
              <InputField
                name="phone"
                type="tel"
                placeholder="01012345678"
                value={phone}
                onChange={onChangePhone}
                maxLength={11}
              />

              <SubmitButton
                type="submit"
                button={loading ? "처리 중..." : "상인으로 가입하기"}
                disabled={!isValid || loading}
              />

              {errMsg && (
                <div style={{ color: "#d00", fontSize: 14 }}>{errMsg}</div>
              )}
            </S.InputWrap>
          </form>
          <S.SubDescription>
            이미 LOFO 사용자이신가요?
            <br />
            가입하신 전화번호로 이용할 수 있어요.
            <Link
              to="/auth/login-nopo/nickname"
              style={{ cursor: "pointer", textDecoration: "none" }}
            >
              임시버튼
            </Link>
          </S.SubDescription>
        </S.InputContainer>
      </S.Div>
    </>
  );
}

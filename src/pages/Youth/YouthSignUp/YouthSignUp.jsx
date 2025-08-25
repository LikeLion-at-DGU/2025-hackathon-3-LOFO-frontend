import * as S from "./Styled";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Topnav from "../../../components/Topnav/Topnav";
import InputField from "../../../components/SignUp/InputField";
import SubmitButton from "../../../components/SignUp/SubmitButton";
import { signupYouthByPhone } from "../../../apis/auth";
import { useUserRole } from "../../../hooks/useUserRole";

export default function YouthSignUp() {
  const { setRole } = useUserRole({ verifyOnMount: false });
  const navigate = useNavigate();
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
      const data = await signupYouthByPhone({
        phone_num: phone,
      });

      // redirect가 오면 그대로 라우팅, 아니면 기본 경로로
      if (data?.redirect) {
        setRole("YOUTH");
        navigate(data.redirect);
      } else {
        navigate("/auth/login-youth/nickname", { state: { phone } });
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
          포트폴리오를 쌓는 경험을 해봐요
        </S.Title>
        <S.InputContainer>
          <S.Info>
            <S.InputTitle>전화번호 입력 </S.InputTitle>
            <S.InputDescription>
              1분만에 가입하고 포트폴리오 미션을 시작하세요!
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
                button={loading ? "처리 중..." : "청년으로 가입하기"}
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
          </S.SubDescription>
        </S.InputContainer>
      </S.Div>
    </>
  );
}

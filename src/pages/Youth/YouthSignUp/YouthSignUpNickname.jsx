import * as S from "./Styled";
import { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Topnav from "../../../components/Topnav/Topnav";
import InputField from "../../../components/SignUp/InputField";
import SubmitButton from "../../../components/SignUp/SubmitButton";
import { signupYouthByNickname } from "../../../apis/auth";
import { useUserRole } from "../../../hooks/useUserRole";

export default function YouthSignUpNickname() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setRole } = useUserRole({ verifyOnMount: false });

  const phone = state?.phone ?? sessionStorage.getItem("signup_phone") ?? "";

  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  //닉네임조건
  const onChangeNickname = (e) => setNickname(e.target.value);
  const nicknameValid = useMemo(() => nickname.trim().length >= 1, [nickname]);
  const isValid = nicknameValid;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setErrMsg("");

    try {
      const data = await signupYouthByNickname({
        phone_num: phone,
        nickname: nickname.trim(),
      });

      // 성공 후 이동
      setRole("YOUTH");
      navigate(data?.redirect ?? "/youth/home");
    } catch (err) {
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
        <S.Title style={{ marginTop:"111px" }}>닉네임을 정하고 미션을 시작하세요!</S.Title>
        <S.InputContainer>
          <S.Info>
            <S.InputTitle>닉네임 입력</S.InputTitle>
            <S.InputDescription>
              LOFO에서 사용할 닉네임을 설정해주세요
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
                name="nickname"
                placeholder="김로포"
                value={nickname}
                onChange={onChangeNickname}
                maxLength={20}
              />

              <SubmitButton
                type="submit"
                button={loading ? "처리 중..." : "가입완료"}
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

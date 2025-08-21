import { instance } from "./instance";

//------------------------ 청년 회원가입/로그인 기능을 posts로 불러옵니다. ------------------------//

// phone_num 입력
export async function signupYouthByPhone({ phone_num }) {
  const { data } = await instance.post("/auth/login-youth", {
    phone_num,
  });
  return data; // { message, redirect }
}

// nickname 입력
export async function signupYouthByNickname({ phone_num, nickname }) {
  const { data } = await instance.post("/auth/login-youth", {
    phone_num,
    nickname,
  });
  return data; // { message, redirect }
}


//------------------------ 상인 회원가입/로그인 기능을 posts로 불러옵니다. ------------------------//

export async function signupNopoByPhone({ phone_num }) {
  const { data } = await instance.post("/auth/login-nopo", {
    phone_num,
  });
  return data; // { message, redirect }
}

export async function signupNopoByNickname({ phone_num, nickname }) {
  const { data } = await instance.post("/auth/login-nopo", {
    phone_num,
    nickname,
  });
  return data; // { message, redirect }
}

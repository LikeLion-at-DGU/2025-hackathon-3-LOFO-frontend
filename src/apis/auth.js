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


//------------------------ 로그아웃 기능을 posts로 불러옵니다. ------------------------//

export async function requestLogout() {
  console.log("[logout] ▶ POST /auth/logout");
  try {
    const res = await instance.post("/auth/logout");
    console.log("[logout] ◀ response", res.status, res.data);
    return res.data;
  } catch (err) {
    if (err.response) {
      console.log("[logout] ✖ server error", err.response.status, err.response.data);
    } else {
      console.log("[logout] ✖ network error", err.message);
    }
    throw err;
  }
}

// 에러 나면 이걸로
//export async function requestLogout() {
//  const { data } = await instance.post("/auth/logout");
//  return data;
//}
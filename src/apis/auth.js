import { instance } from "./instance";

// BE가 요구하는 키 이름이 phone_num, nickname 임에 주의!

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

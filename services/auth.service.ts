import { apiFetch } from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "@/types/auth";

// payload값은 객체값
export function login(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/api/users/login", {
    method: "POST",
    // 문자열로 바꾸는 이유: 서버로 데이터를 보낼 때 객체를 문자열로 변환하여 전송해야 하기 때문
    // 로그인 요청 객체를 서버가 이해할 수 있는 JSON 형식의 문자열로 바꿔서 요청 body에 담는다
    body: JSON.stringify(payload),
  });
}

export function signup(payload: SignupRequest) {
  return apiFetch<SignupResponse>("/api/users/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
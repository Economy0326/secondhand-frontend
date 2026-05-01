import { apiFetch } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

// payload값은 객체값
export function login(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/api/users/login", {
    method: "POST",
    // 문자열로 바꾸는 이유: 서버로 데이터를 보낼 때 객체를 문자열로 변환하여 전송해야 하기 때문
    body: JSON.stringify(payload),
  });
}
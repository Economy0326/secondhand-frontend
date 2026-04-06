import { apiFetch } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

// payload값은 객체값
export function login(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/api/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
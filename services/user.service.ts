import { apiFetch } from "@/lib/api";
import { UpdateUserRequest, User } from "@/types/user";

export function getMyInfo() {
  return apiFetch<User>("/api/users/me", {
    auth: true,
  });
}

export function updateMyInfo(payload: UpdateUserRequest) {
  return apiFetch<User>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function deleteMyAccount() {
  return apiFetch<void>("/api/users/me", {
    method: "DELETE",
    auth: true,
  });
}
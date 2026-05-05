import { apiFetch } from "@/lib/api";
import { AnswerQnaRequest, CreateQnaRequest, Qna } from "@/types/qna";

export function getProductQnas(productId: number) {
  return apiFetch<Qna[]>(`/api/products/${productId}/qna`);
}

export function createQna(productId: number, payload: CreateQnaRequest) {
  return apiFetch<Qna>(`/api/products/${productId}/qna`, {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function answerQna(qnaId: number, payload: AnswerQnaRequest) {
  return apiFetch<Qna>(`/api/qna/${qnaId}/answer`, {
    method: "PATCH",
    body: JSON.stringify(payload),
    auth: true,
  });
}

export function getMyQnas() {
  return apiFetch<Qna[]>("/api/qna/me", {
    auth: true,
  });
}
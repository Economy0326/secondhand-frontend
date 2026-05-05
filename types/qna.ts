export interface Qna {
  qnaId: number;
  productId: number;
  userId: number;
  userNickname: string;
  question: string;
  answer: string | null;
  createdAt: string;
}

export interface CreateQnaRequest {
  question: string;
}

export interface AnswerQnaRequest {
  answer: string;
}
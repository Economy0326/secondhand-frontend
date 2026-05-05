// export: 다른 파일에서도 이 타입을 import 가능하게 해줌
// interface: 객체의 구조(모양)을 정의하는 타입
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  name: string;
  nickname: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  address: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  address: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "DELETED";
  createdAt: string;
}
export interface User {
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

export interface UpdateUserRequest {
  nickname?: string;
  phoneNumber?: string;
  address?: string;
}
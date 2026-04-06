export function saveAuth(data: {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  name: string;
  nickname: string;
}) {
  // sessionStorage: 문자열 기준으로 데이터를 저장하는 공간
  // JSON.stringify: 자바스크립트 객체를 JSON 문자열로 변환하는 함수
  // setItem: sessionStorage에 데이터를 저장하는 메서드 (키, 값)
  sessionStorage.setItem("accessToken", data.accessToken);
  sessionStorage.setItem("user", JSON.stringify(data));
}

export function clearAuth() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");
}

// JSON.parse: JSON 문자열을 자바스크립트 객체로 변환하는 함수
export function getStoredUser() {
  const raw = sessionStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

// stringfy: 객체를 문자열로 변환
// parse: 문자열을 객체로 변환
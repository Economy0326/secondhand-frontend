export function saveAuth(data: {
  accessToken: string;
  tokenType: string;
  userId: number;
  email: string;
  name: string;
  nickname: string;
}) {
  if (typeof window === "undefined") return;

  // sessionStorage: 문자열 기준으로 데이터를 저장하는 공간
  // JSON.stringify: 자바스크립트 객체를 JSON 문자열로 변환하는 함수
  // setItem: sessionStorage에 데이터를 저장하는 메서드 (키, 값)
  sessionStorage.setItem("accessToken", data.accessToken);
  sessionStorage.setItem("user", JSON.stringify(data));

  // 같은 탭에서 Header 로그인 상태를 바로 갱신하기 위한 이벤트
  window.dispatchEvent(new Event("auth-change"));
}

export function clearAuth() {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");

  // 같은 탭에서 Header 로그아웃 상태를 바로 갱신하기 위한 이벤트
  // dispatchEvent: 현재 창에서 이벤트를 발생시키는 메서드
  window.dispatchEvent(new Event("auth-change"));
}

// JSON.parse: JSON 문자열을 자바스크립트 객체로 변환하는 함수
export function getStoredUser() {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem("accessToken");
}

// stringfy: 객체를 문자열로 변환
// parse: 문자열을 객체로 변환
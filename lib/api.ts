const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL 환경변수가 설정되지 않았습니다.");
}

// type ApiOptions: apiFetch 함수에 전달되는 옵션 객체의 타입 정의
type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  // ...rest: options 객체에서 auth와 headers를 제외한 나머지 속성들을 rest 객체에 담음
  // auth나 headers를 제외하고는 바로 fetch 함수에 전달할 수 있도록 rest 객체로 분리
  const { auth = false, headers, ...rest } = options;

  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(rest.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    // cache: fetch 옵션 중 하나로, 응답을 캐시에 저장하지 말고, 항상 새로 요청하라는 뜻
    cache: "no-store",
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      // sessionStorage: 브라우저에 데이터를 잠깐 저장해두는 공간(탭을 닫으면 사라짐)
      // localStorage: 브라우저에 데이터를 영구적으로 저장해두는 공간(직접 지워야 함)
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error("인증이 만료되었습니다.");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "요청에 실패했습니다.");
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
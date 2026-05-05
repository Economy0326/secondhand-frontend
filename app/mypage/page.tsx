"use client";

import Link from "next/link";
import ProductListCard from "@/components/product/ProductListCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getStoredAccessToken, saveAuth } from "@/lib/storage";
import { formatPrice } from "@/lib/format";
import {
  deleteMyAccount,
  getMyInfo,
  updateMyInfo,
} from "@/services/user.service";
import { getMyLikes } from "@/services/like.service";
import { getMyBids } from "@/services/bid.service";
import { getMyQnas } from "@/services/qna.service";
import { getMyProducts } from "@/services/product.service";
import { User } from "@/types/user";
import { Like } from "@/types/like";
import { Bid } from "@/types/bid";
import { Qna } from "@/types/qna";
import { Product } from "@/types/product";

type MyPageTab =
  | "PROFILE"
  | "MY_PRODUCTS"
  | "MY_BIDS"
  | "MY_LIKES"
  | "MY_QNA";

function getThumbnailUrl(
  images?: { imageUrl: string; isThumbnail: boolean }[]
) {
  if (!images || images.length === 0) return undefined;
  // 썸네일로 지정된 이미지가 있으면 해당 이미지의 URL을 반환하고, 그렇지 않으면 첫 번째 이미지의 URL을 반환
  return images.find((image) => image.isThumbnail)?.imageUrl ?? images[0].imageUrl;
}

export default function MyPage() {
  // useRouter: Next.js에서 페이지 이동을 제어할 수 있는 훅
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState<MyPageTab>("PROFILE");

  const [myLikes, setMyLikes] = useState<Like[]>([]);
  // isLoadingLikes: 내 찜 목록을 불러오는 중인지 여부를 나타내는 상태
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);

  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [isLoadingBids, setIsLoadingBids] = useState(false);

  const [myQnas, setMyQnas] = useState<Qna[]>([]);
  const [isLoadingQnas, setIsLoadingQnas] = useState(false);

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function loadMyInfo() {
    try {
      const token = getStoredAccessToken();

      if (!token) {
        // router.replace: 현재 페이지를 로그인 페이지로 대체하여 이동.
        // replace를 사용하면 사용자가 뒤로 가기 버튼을 눌렀을 때 로그인 페이지로 돌아가지 않음
        router.replace("/login");
        return;
      }

      const result = await getMyInfo();

      setUser(result);
      setNickname(result.nickname);
      setPhoneNumber(result.phoneNumber);
      setAddress(result.address);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "내 정보를 불러오지 못했습니다."
      );
    } finally {
      setIsCheckingAuth(false);
    }
  }

  useEffect(() => {
    loadMyInfo();
  }, [router]);

  async function handleUpdateSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    try {
      setIsPending(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!nickname.trim()) {
        throw new Error("닉네임을 입력해주세요.");
      }

      if (!phoneNumber.trim()) {
        throw new Error("전화번호를 입력해주세요.");
      }

      if (!address.trim()) {
        throw new Error("주소를 입력해주세요.");
      }

      const updatedUser = await updateMyInfo({
        nickname,
        phoneNumber,
        address,
      });

      setUser(updatedUser);
      setNickname(updatedUser.nickname);
      setPhoneNumber(updatedUser.phoneNumber);
      setAddress(updatedUser.address);

      const token = getStoredAccessToken();

      if (token) {
        // saveAuth가 실행되면서 앱 전체에서 사용자 정보가 업데이트된 것을 인지할 수 있도록 함
        saveAuth({
          accessToken: token,
          tokenType: "Bearer",
          userId: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          nickname: updatedUser.nickname,
        });
      }

      setSuccessMessage("내 정보가 수정되었습니다.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "내 정보 수정에 실패했습니다."
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeleteAccount() {
    // window 사용 이유: confirm 대화상자는 브라우저에서 제공하는 기본 기능이므로, 클라이언트 측에서만 사용할 수 있음
    const confirmed = window.confirm(
      "정말 탈퇴하시겠습니까? 탈퇴 후 계정 상태가 비활성화됩니다."
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await deleteMyAccount();

      clearAuth();
      router.replace("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function loadMyLikes() {
    try {
      setIsLoadingLikes(true);
      setErrorMessage("");

      const result = await getMyLikes();
      setMyLikes(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "내 찜 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsLoadingLikes(false);
    }
  }

  async function loadMyBids() {
    try {
      setIsLoadingBids(true);
      setErrorMessage("");

      const result = await getMyBids();
      setMyBids(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "내 입찰 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsLoadingBids(false);
    }
  }

  async function loadMyQnas() {
    try {
      setIsLoadingQnas(true);
      setErrorMessage("");

      const result = await getMyQnas();
      setMyQnas(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "내 질문 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsLoadingQnas(false);
    }
  }

  async function loadMyProducts() {
    try {
      setIsLoadingProducts(true);
      setErrorMessage("");

      const result = await getMyProducts();
      setMyProducts(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "내 등록 상품 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsLoadingProducts(false);
    }
  }

  useEffect(() => {
    if (activeTab === "MY_PRODUCTS") {
      loadMyProducts();
    }

    if (activeTab === "MY_LIKES") {
      loadMyLikes();
    }

    if (activeTab === "MY_BIDS") {
      loadMyBids();
    }

    if (activeTab === "MY_QNA") {
      loadMyQnas();
    }
  }, [activeTab]);

  const menu: { label: string; value: MyPageTab }[] = [
    { label: "내 정보 수정", value: "PROFILE" },
    { label: "내 등록 상품", value: "MY_PRODUCTS" },
    { label: "내 입찰 목록", value: "MY_BIDS" },
    { label: "내 찜 목록", value: "MY_LIKES" },
    { label: "내 질문 목록", value: "MY_QNA" },
  ];

  if (isCheckingAuth) {
    return (
      <section className="container-default flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="luxury-panel p-8 text-center">
          <p className="text-white/70">로그인 상태를 확인하는 중입니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-default py-12 md:py-16">
      <div className="mb-10">
        {/* tracking-[0.2em]: 글자 간격 조절 */}
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          My Account
        </p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          마이페이지
        </h1>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 p-4 text-sm text-[var(--accent)]">
          {successMessage}
        </div>
      )}

      {/* grid-cols-[280px_1fr]: 첫 번째 열은 280px 고정, 두 번째 열은 남은 공간을 차지하도록 설정 */}
      {/* fr: 남은 공간을 차지함 */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="luxury-panel h-fit p-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/45">회원</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {user?.nickname ?? "user"}
            </p>
            <p className="mt-2 text-sm text-white/55">
              {user?.email ?? "email@example.com"}
            </p>

            <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-sm text-white/55">
              <p>이름: {user?.name ?? "-"}</p>
              <p>전화번호: {user?.phoneNumber ?? "-"}</p>
              <p>주소: {user?.address ?? "-"}</p>
              <p>상태: {user?.status ?? "-"}</p>
            </div>
          </div>

          <nav className="mt-4 space-y-2">
            {menu.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setActiveTab(item.value)}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm transition ${
                  activeTab === item.value
                    ? "bg-[var(--accent)] text-black"
                    : "border border-white/10 text-white/75 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="luxury-panel p-6 md:p-8">
          {activeTab === "PROFILE" && (
            <>
              <h2 className="text-2xl font-semibold text-white">내 정보 수정</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                닉네임, 전화번호, 주소를 수정할 수 있습니다.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleUpdateSubmit}>
                <div>
                  <label className="mb-2 block text-sm text-white/70">이메일</label>
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/40 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">이름</label>
                  <input
                    type="text"
                    value={user?.name ?? ""}
                    disabled
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/40 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">닉네임</label>
                  <input
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">전화번호</label>
                  <input
                    type="text"
                    placeholder="010-1234-5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">주소</label>
                  <input
                    type="text"
                    placeholder="주소를 입력하세요"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                >
                  {isPending ? "수정 중..." : "내 정보 수정하기"}
                </button>
              </form>

              <div className="mt-10 border-t border-white/10 pt-8">
                <h3 className="text-xl font-semibold text-white">회원 탈퇴</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  회원 탈퇴 시 계정 상태가 비활성화되며, 다시 로그인할 수 없을 수 있습니다.
                </p>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="mt-5 rounded-full border border-red-400/30 bg-red-400/10 px-6 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-400/15 disabled:opacity-60"
                >
                  {isDeleting ? "탈퇴 처리 중..." : "회원 탈퇴하기"}
                </button>
              </div>
            </>
          )}

          {activeTab === "MY_PRODUCTS" && (
            <>
              <h2 className="text-2xl font-semibold text-white">내 등록 상품</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                내가 등록한 일반 판매 상품과 경매 상품을 확인할 수 있습니다.
              </p>

              <div className="mt-8">
                {isLoadingProducts ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    등록 상품 목록을 불러오는 중입니다.
                  </div>
                ) : myProducts.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    아직 등록한 상품이 없습니다.
                  </div>
                ) : (
                  <div className="grid gap-6 xl:grid-cols-2">
                    {myProducts.map((product) => (
                      <ProductListCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        imageUrl={getThumbnailUrl(product.images)}
                        isAuction={product.status === "AUCTION"}
                        currentPrice={product.currentPrice}
                        buyNowPrice={product.buyNowPrice}
                        startPrice={product.startPrice}
                        likes={0}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "MY_BIDS" && (
            <>
              <h2 className="text-2xl font-semibold text-white">내 입찰 목록</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                내가 참여한 경매 입찰 내역을 확인할 수 있습니다.
              </p>

              <div className="mt-8 space-y-3">
                {isLoadingBids ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    입찰 목록을 불러오는 중입니다.
                  </div>
                ) : myBids.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    아직 입찰한 경매가 없습니다.
                  </div>
                ) : (
                  myBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {bid.productTitle}
                          </p>
                          <p className="mt-2 text-sm text-white/70">
                            입찰가 {formatPrice(bid.bidPrice)}
                          </p>
                          <p className="mt-2 text-sm text-white/45">
                            입찰 시간 {new Date(bid.bidTime).toLocaleString("ko-KR")}
                          </p>
                          <p className="mt-1 text-sm text-white/45">
                            경매 상태 {bid.auctionStatus}
                          </p>
                        </div>

                        <Link
                          href={`/products/${bid.productId}`}
                          className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2 text-center text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/15"
                        >
                          상품 보러가기
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "MY_LIKES" && (
            <>
              <h2 className="text-2xl font-semibold text-white">내 찜 목록</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                내가 찜한 상품을 확인할 수 있습니다.
              </p>

              <div className="mt-8 space-y-3">
                {isLoadingLikes ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    찜 목록을 불러오는 중입니다.
                  </div>
                ) : myLikes.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    아직 찜한 상품이 없습니다.
                  </div>
                ) : (
                  myLikes.map((like) => (
                    <div
                      key={like.likeId}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {like.productTitle}
                          </p>
                          <p className="mt-2 text-sm text-white/45">
                            찜한 날짜{" "}
                            {new Date(like.createdAt).toLocaleString("ko-KR")}
                          </p>
                        </div>

                        <Link
                          href={`/products/${like.productId}`}
                          className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2 text-center text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/15"
                        >
                          상품 보러가기
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === "MY_QNA" && (
            <>
              <h2 className="text-2xl font-semibold text-white">내 질문 목록</h2>
              <p className="mt-3 text-sm leading-6 text-white/60">
                내가 상품에 남긴 질문과 답변 상태를 확인할 수 있습니다.
              </p>

              <div className="mt-8 space-y-3">
                {isLoadingQnas ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    질문 목록을 불러오는 중입니다.
                  </div>
                ) : myQnas.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
                    아직 작성한 질문이 없습니다.
                  </div>
                ) : (
                  myQnas.map((qna) => (
                    <div
                      key={qna.qnaId}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs text-[var(--accent)]">
                              {qna.answer ? "답변 완료" : "답변 대기"}
                            </span>
                            <span className="text-xs text-white/35">
                              {new Date(qna.createdAt).toLocaleString("ko-KR")}
                            </span>
                          </div>

                          <div className="mt-4">
                            <p className="text-xs text-[var(--accent)]">Q.</p>
                            <p className="mt-1 text-sm leading-6 text-white/80">
                              {qna.question}
                            </p>
                          </div>

                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs text-[var(--accent)]">A.</p>
                            {qna.answer ? (
                              <p className="mt-1 text-sm leading-6 text-white/75">
                                {qna.answer}
                              </p>
                            ) : (
                              <p className="mt-1 text-sm text-white/40">
                                아직 답변이 등록되지 않았습니다.
                              </p>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/products/${qna.productId}`}
                          className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-5 py-2 text-center text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/15"
                        >
                          상품 보러가기
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
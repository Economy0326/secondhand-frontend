"use client";

import Link from "next/link";
import ProductListCard from "@/components/product/ProductListCard";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clearAuth, getStoredAccessToken, saveAuth } from "@/lib/storage";
import { formatPrice } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import {
  deleteMyAccount,
  getMyInfo,
  updateMyInfo,
} from "@/services/user.service";
import { getMyLikes } from "@/services/like.service";
import { getMyBids } from "@/services/bid.service";
import { getMyQnas } from "@/services/qna.service";
import { getMyProducts } from "@/services/product.service";
import type { User } from "@/types/user";
import type { Like } from "@/types/like";
import type { Bid } from "@/types/bid";
import type { Qna } from "@/types/qna";
import type { Product } from "@/types/product";

type MyPageTab =
  | "PROFILE"
  | "MY_PRODUCTS"
  | "MY_BIDS"
  | "MY_LIKES"
  | "MY_QNA";

function getThumbnailUrl(
  images?: { imageUrl: string; isThumbnail: boolean }[],
) {
  if (!images || images.length === 0) return undefined;

  // 썸네일로 지정된 이미지가 있으면 해당 이미지의 URL을 반환하고,
  // 그렇지 않으면 첫 번째 이미지의 URL을 반환
  return (
    images.find((image) => image.isThumbnail)?.imageUrl ?? images[0].imageUrl
  );
}

export default function MyPage() {
  // useRouter: Next.js에서 페이지 이동을 제어할 수 있는 훅
  const router = useRouter();
  const queryClient = useQueryClient();

  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<MyPageTab>("PROFILE");

  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = getStoredAccessToken();

    if (!token) {
      router.replace("/login");
      setHasToken(false);
      return;
    }

    setHasToken(true);
  }, [router]);

  // useQuery: TanStack Query에서 데이터를 가져오고 캐싱하는 훅
  const myInfoQuery = useQuery<User>({
    queryKey: queryKeys.me,
    queryFn: getMyInfo,
    enabled: hasToken === true,
  });

  const myProductsQuery = useQuery<Product[]>({
    queryKey: queryKeys.myProducts,
    queryFn: getMyProducts,
    enabled: hasToken === true && activeTab === "MY_PRODUCTS",
  });

  // isLoadingLikes: 내 찜 목록을 불러오는 중인지 여부를 나타내는 상태
  // TanStack Query 적용 후에는 myLikesQuery.isLoading으로 관리
  const myLikesQuery = useQuery<Like[]>({
    queryKey: queryKeys.myLikes,
    queryFn: getMyLikes,
    enabled: hasToken === true && activeTab === "MY_LIKES",
  });

  const myBidsQuery = useQuery<Bid[]>({
    queryKey: queryKeys.myBids,
    queryFn: getMyBids,
    enabled: hasToken === true && activeTab === "MY_BIDS",
  });

  const myQnasQuery = useQuery<Qna[]>({
    queryKey: queryKeys.myQnas,
    queryFn: getMyQnas,
    enabled: hasToken === true && activeTab === "MY_QNA",
  });

  const user = myInfoQuery.data;
  const myProducts = myProductsQuery.data ?? [];
  const myLikes = myLikesQuery.data ?? [];
  const myBids = myBidsQuery.data ?? [];
  const myQnas = myQnasQuery.data ?? [];

  useEffect(() => {
    if (!user) return;

    setNickname(user.nickname ?? "");
    setPhoneNumber(user.phoneNumber ?? "");
    setAddress(user.address ?? "");
  }, [user]);

  useEffect(() => {
    const queryError =
      myInfoQuery.error ||
      myProductsQuery.error ||
      myLikesQuery.error ||
      myBidsQuery.error ||
      myQnasQuery.error;

    if (!queryError) return;

    setErrorMessage(
      queryError instanceof Error
        ? queryError.message
        : "데이터를 불러오지 못했습니다.",
    );
  }, [
    myInfoQuery.error,
    myProductsQuery.error,
    myLikesQuery.error,
    myBidsQuery.error,
    myQnasQuery.error,
  ]);

  async function handleUpdateSubmit(e: React.FormEvent) {
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

      queryClient.setQueryData(queryKeys.me, updatedUser);
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });

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
        error instanceof Error ? error.message : "내 정보 수정에 실패했습니다.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleDeleteAccount() {
    // window 사용 이유: confirm 대화상자는 브라우저에서 제공하는 기본 기능이므로,
    // 클라이언트 측에서만 사용할 수 있음
    const confirmed = window.confirm(
      "정말 탈퇴하시겠습니까? 탈퇴 후 계정 상태가 비활성화됩니다.",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await deleteMyAccount();

      clearAuth();
      queryClient.clear();

      router.replace("/");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "회원 탈퇴에 실패했습니다.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const menu: { label: string; value: MyPageTab }[] = [
    { label: "내 정보 수정", value: "PROFILE" },
    { label: "내 등록 상품", value: "MY_PRODUCTS" },
    { label: "내 입찰 목록", value: "MY_BIDS" },
    { label: "내 찜 목록", value: "MY_LIKES" },
    { label: "내 질문 목록", value: "MY_QNA" },
  ];

  if (hasToken === null || myInfoQuery.isLoading) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-white/70">로그인 상태를 확인하는 중입니다.</p>
      </section>
    );
  }

  if (hasToken === false) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-white/70">로그인 페이지로 이동하는 중입니다.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* tracking-[0.2em]: 글자 간격 조절 */}
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        My Account
      </p>

      <h1 className="mt-3 text-3xl font-bold text-white">마이페이지</h1>

      {errorMessage && (
        <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </p>
      )}

      {/* grid-cols-[280px_1fr]: 첫 번째 열은 280px 고정, 두 번째 열은 남은 공간을 차지하도록 설정 */}
      {/* fr: 남은 공간을 차지함 */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="rounded-2xl bg-black/20 p-4">
            <p className="text-sm text-white/50">회원</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {user?.nickname ?? "user"}
            </p>
            <p className="mt-1 text-sm text-white/50">
              {user?.email ?? "email@example.com"}
            </p>
            <div className="mt-4 space-y-1 text-xs text-white/45">
              <p>이름: {user?.name ?? "-"}</p>
              <p>전화번호: {user?.phoneNumber ?? "-"}</p>
              <p>주소: {user?.address ?? "-"}</p>
              <p>상태: {user?.status ?? "-"}</p>
            </div>
          </div>

          <nav className="mt-5 space-y-2">
            {menu.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setActiveTab(item.value);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
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

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          {activeTab === "PROFILE" && (
            <>
              <h2 className="text-2xl font-bold text-white">내 정보 수정</h2>
              <p className="mt-2 text-white/55">
                닉네임, 전화번호, 주소를 수정할 수 있습니다.
              </p>

              <form onSubmit={handleUpdateSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    이름
                  </label>
                  <input
                    type="text"
                    value={user?.name ?? ""}
                    disabled
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/50 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    닉네임
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    전화번호
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-white/70">
                    주소
                  </label>
                  <input
                    type="text"
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

              <div className="mt-10 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                <h3 className="text-lg font-semibold text-red-200">
                  회원 탈퇴
                </h3>
                <p className="mt-2 text-sm text-red-100/70">
                  회원 탈퇴 시 계정 상태가 비활성화되며, 다시 로그인할 수
                  없을 수 있습니다.
                </p>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="mt-4 rounded-full border border-red-400/40 px-6 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/10 disabled:opacity-60"
                >
                  {isDeleting ? "탈퇴 처리 중..." : "회원 탈퇴하기"}
                </button>
              </div>
            </>
          )}

          {activeTab === "MY_PRODUCTS" && (
            <>
              <h2 className="text-2xl font-bold text-white">내 등록 상품</h2>
              <p className="mt-2 text-white/55">
                내가 등록한 일반 판매 상품과 경매 상품을 확인할 수 있습니다.
              </p>

              {myProductsQuery.isLoading ? (
                <p className="mt-6 text-white/60">
                  등록 상품 목록을 불러오는 중입니다.
                </p>
              ) : myProducts.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/10 p-6 text-white/55">
                  아직 등록한 상품이 없습니다.
                </p>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {myProducts.map((product) => (
                    <div key={product.id} className="space-y-3">
                      <ProductListCard
                        id={product.id}
                        title={product.title}
                        description={product.description}
                        imageUrl={getThumbnailUrl(product.images)}
                        isAuction={product.status === "AUCTION"}
                        currentPrice={product.currentPrice}
                        startPrice={product.startPrice}
                        buyNowPrice={product.buyNowPrice}
                        likes={product.likeCount}
                        status={product.auctionStatus ?? undefined}
                        auctionStartTime={product.auctionStartTime}
                        auctionEndTime={product.auctionEndTime}
                      />

                      {/* 실수 방지를 위해서 삭제 버튼은 판매자 관리에서 처리 */}
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product.id}/edit`}
                          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5"
                        >
                          수정하기
                        </Link>
                        <Link
                          href={`/products/${product.id}`}
                          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5"
                        >
                          상세 보기
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "MY_BIDS" && (
            <>
              <h2 className="text-2xl font-bold text-white">내 입찰 목록</h2>
              <p className="mt-2 text-white/55">
                내가 참여한 경매 입찰 내역을 확인할 수 있습니다.
              </p>

              {myBidsQuery.isLoading ? (
                <p className="mt-6 text-white/60">
                  입찰 목록을 불러오는 중입니다.
                </p>
              ) : myBids.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/10 p-6 text-white/55">
                  아직 입찰한 경매가 없습니다.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {myBids.map((bid) => (
                    <article
                      key={bid.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">
                            {bid.productTitle}
                          </h3>
                          <p className="mt-2 text-sm text-white/55">
                            입찰가 {formatPrice(bid.bidPrice)}
                          </p>
                          <p className="mt-1 text-xs text-white/40">
                            입찰 시간{" "}
                            {new Date(bid.bidTime).toLocaleString("ko-KR")}
                          </p>
                        </div>

                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                          경매 상태 {bid.auctionStatus}
                        </span>
                      </div>

                      <Link
                        href={`/products/${bid.productId}`}
                        className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-black"
                      >
                        상품 보러가기
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 내 찜 목록 카드형으로 표시*/}
          {activeTab === "MY_LIKES" && (
            <>
              <h2 className="text-2xl font-bold text-white">내 찜 목록</h2>
              <p className="mt-2 text-white/55">
                내가 찜한 상품을 카드로 확인할 수 있습니다.
              </p>

              {myLikesQuery.isLoading ? (
                <p className="mt-6 text-white/60">
                  찜 목록을 불러오는 중입니다.
                </p>
              ) : myLikes.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/10 p-6 text-white/55">
                  아직 찜한 상품이 없습니다.
                </p>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {myLikes.map((like) =>
                    like.product ? (
                      <ProductListCard
                        key={like.likeId}
                        id={like.product.id}
                        title={like.product.title}
                        description={like.product.description}
                        imageUrl={getThumbnailUrl(like.product.images)}
                        isAuction={like.product.status === "AUCTION"}
                        currentPrice={like.product.currentPrice}
                        startPrice={like.product.startPrice}
                        buyNowPrice={like.product.buyNowPrice}
                        likes={like.product.likeCount}
                        status={like.product.auctionStatus ?? undefined}
                        auctionStartTime={like.product.auctionStartTime}
                        auctionEndTime={like.product.auctionEndTime}
                      />
                    ) : (
                      <article
                        key={like.likeId}
                        className="rounded-2xl border border-white/10 bg-black/20 p-5"
                      >
                        <h3 className="font-semibold text-white">
                          {like.productTitle}
                        </h3>
                        <p className="mt-2 text-sm text-white/45">
                          찜한 날짜{" "}
                          {new Date(like.createdAt).toLocaleString("ko-KR")}
                        </p>
                        <Link
                          href={`/products/${like.productId}`}
                          className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-black"
                        >
                          상품 보러가기
                        </Link>
                      </article>
                    ),
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "MY_QNA" && (
            <>
              <h2 className="text-2xl font-bold text-white">내 질문 목록</h2>
              <p className="mt-2 text-white/55">
                내가 상품에 남긴 질문과 답변 상태를 확인할 수 있습니다.
              </p>

              {myQnasQuery.isLoading ? (
                <p className="mt-6 text-white/60">
                  질문 목록을 불러오는 중입니다.
                </p>
              ) : myQnas.length === 0 ? (
                <p className="mt-6 rounded-2xl border border-white/10 p-6 text-white/55">
                  아직 작성한 질문이 없습니다.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {myQnas.map((qna) => (
                    <article
                      key={qna.qnaId}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                          {qna.answer ? "답변 완료" : "답변 대기"}
                        </span>
                        <span className="text-xs text-white/40">
                          {new Date(qna.createdAt).toLocaleString("ko-KR")}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-[var(--accent)]">
                            Q.
                          </p>
                          <p className="mt-1 text-sm text-white/80">
                            {qna.question}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-[var(--accent)]">
                            A.
                          </p>
                          {qna.answer ? (
                            <p className="mt-1 text-sm text-white/70">
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
                        className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-black"
                      >
                        상품 보러가기
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
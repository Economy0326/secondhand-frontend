"use client";

import { useEffect, useState } from "react";
import { answerQna, createQna, getProductQnas } from "@/services/qna.service";
import { getStoredUser } from "@/lib/storage";
import { Qna } from "@/types/qna";

type Props = {
  productId: number;
  sellerId: number;
};

type StoredUser = {
  userId: number;
  nickname: string;
} | null;

export default function QnaSection({ productId, sellerId }: Props) {
  const [qnas, setQnas] = useState<Qna[]>([]);
  const [question, setQuestion] = useState("");

  // qnaId별 답변 입력값을 따로 관리하기 위한 상태
  const [answerMap, setAnswerMap] = useState<Record<number, string>>({});

  const [user, setUser] = useState<StoredUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [answerPendingId, setAnswerPendingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const canAnswer = user?.userId === sellerId;

  async function loadQnas() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await getProductQnas(productId);
      setQnas(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "QnA 목록을 불러오지 못했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setUser(getStoredUser());
    loadQnas();
  }, [productId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // preventDefault: 폼이 제출될 때 페이지가 새로고침되는 기본 동작을 막음
    e.preventDefault();

    try {
      setIsPending(true);
      setErrorMessage("");

      if (!question.trim()) {
        throw new Error("질문 내용을 입력해주세요.");
      }

      await createQna(productId, {
        question,
      });

      setQuestion("");
      await loadQnas();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "질문 등록에 실패했습니다."
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleAnswerSubmit(qnaId: number) {
    try {
      setAnswerPendingId(qnaId);
      setErrorMessage("");

      const answer = answerMap[qnaId];

      if (!answer || !answer.trim()) {
        throw new Error("답변 내용을 입력해주세요.");
      }

      await answerQna(qnaId, {
        answer,
      });

      setAnswerMap((prev) => ({
        ...prev,
        [qnaId]: "",
      }));

      await loadQnas();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "답변 등록에 실패했습니다."
      );
    } finally {
      setAnswerPendingId(null);
    }
  }

  return (
    <section className="mt-10 luxury-panel p-6 md:p-8">
      <div className="mb-6">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Product QnA
        </p>
        <h2 className="text-2xl font-semibold text-white">상품 QnA</h2>
        <p className="mt-3 text-sm leading-6 text-white/60">
          상품에 대해 궁금한 점을 남기고 판매자의 답변을 확인할 수 있습니다.
        </p>
      </div>

      <form className="mb-8 space-y-3" onSubmit={handleSubmit}>
        <textarea
          placeholder="상품에 대해 궁금한 점을 입력하세요."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
        />

        {errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? "등록 중..." : "질문 등록"}
        </button>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
            QnA 목록을 불러오는 중입니다.
          </div>
        ) : qnas.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
            아직 등록된 질문이 없습니다.
          </div>
        ) : (
          qnas.map((qna) => (
            <div
              key={qna.qnaId}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/45">
                  질문자 {qna.userNickname}
                </p>
                <p className="text-xs text-white/35">
                  {new Date(qna.createdAt).toLocaleString("ko-KR")}
                </p>
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

              {canAnswer && !qna.answer && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <label className="block text-sm text-white/70">
                    판매자 답변 등록
                  </label>
                  <textarea
                    placeholder="질문에 대한 답변을 입력하세요."
                    value={answerMap[qna.qnaId] ?? ""}
                    onChange={(e) =>
                      setAnswerMap((prev) => ({
                        ...prev,
                        [qna.qnaId]: e.target.value,
                      }))
                    }
                    className="min-h-[100px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/30"
                  />

                  <button
                    type="button"
                    onClick={() => handleAnswerSubmit(qna.qnaId)}
                    disabled={answerPendingId === qna.qnaId}
                    className="rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                  >
                    {answerPendingId === qna.qnaId
                      ? "답변 등록 중..."
                      : "답변 등록"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
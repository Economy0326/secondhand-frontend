export default function SignupPage() {
  return (
    <section className="container-default flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <div className="luxury-panel w-full max-w-lg p-8 md:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Join Us
        </p>
        <h1 className="text-3xl font-semibold text-white">회원가입</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          새로운 계정을 만들고 프리미엄 중고 거래와 경매를 시작해보세요.
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-white/70">이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">이메일</label>
            <input
              type="email"
              placeholder="example@email.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/70">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30"
            />
          </div>

          <button className="mt-2 w-full rounded-full bg-[var(--accent)] px-6 py-3 font-semibold text-black transition hover:opacity-90">
            회원가입
          </button>
        </form>
      </div>
    </section>
  );
}
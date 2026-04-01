export default function LoginPage() {
  return (
    // items-center: flex 방향의 반대축 정렬(세로), justify-center: flex방향으로 정렬(가로)
    <section className="container-default flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <div className="luxury-panel w-full max-w-md p-8 md:p-10">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          Welcome Back
        </p>
        <h1 className="text-3xl font-semibold text-white">로그인</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          계정에 로그인하고 경매 입찰과 찜 기능을 이용해보세요.
        </p>

        <form className="mt-8 space-y-4">
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
            로그인
          </button>
        </form>
      </div>
    </section>
  );
}
type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({ eyebrow, title, description }: Props) {
  return (
    <div>
      {eyebrow && (
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[var(--accent)]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-semibold text-white">{title}</h2>

      {description && (
        // leading: 줄간격 -> 한 줄이 차지하는 세로 공간
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
          {description}
        </p>
      )}
    </div>
  );
}
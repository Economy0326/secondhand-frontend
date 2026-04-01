type AuctionStatus = "READY" | "RUNNING" | "FINISHED";

type Props = {
  status: AuctionStatus;
};

const statusLabelMap = {
  READY: "경매 시작 전",
  RUNNING: "경매 진행중",
  FINISHED: "경매 종료",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs text-[var(--accent)]">
      {statusLabelMap[status]}
    </span>
  );
}
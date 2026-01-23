export default function AIBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#4c65f0] to-[#657dff] animate-pulse-subtle ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
      <span className="text-xs font-semibold text-white tracking-tight">
        AI Recommended
      </span>
    </div>
  );
}

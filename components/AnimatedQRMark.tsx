type AnimatedQRMarkProps = {
  className?: string;
};

export function AnimatedQRMark({ className = "" }: AnimatedQRMarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`grid size-[62px] shrink-0 grid-cols-5 grid-rows-5 gap-1 text-[var(--accent-start)] ${className}`}
    >
      <div className="col-[1/3] row-[1/3] rounded border-[3px] border-current" />
      <div className="col-[4/6] row-[1/3] rounded border-[3px] border-current" />
      <div className="col-[1/3] row-[4/6] rounded border-[3px] border-current" />
      <div className="col-start-3 row-start-3 rounded-sm bg-current" />
      <div className="col-start-4 row-start-3 rounded-sm bg-current/45 animate-module-flicker" />
      <div className="col-start-5 row-start-3 rounded-sm bg-current" />
      <div className="col-start-4 row-start-4 rounded-sm bg-current" />
      <div className="col-start-4 row-start-5 rounded-sm bg-current/45 animate-module-flicker-delayed" />
      <div className="col-start-5 row-start-5 rounded-sm bg-current" />
    </div>
  );
}

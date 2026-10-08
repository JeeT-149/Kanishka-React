import { useToast } from "../../context/ToastContext";
import { IconX } from "./Icons";

export function Toast() {
  const { toast, hideToast, pauseToast, resumeToast } = useToast();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      onMouseEnter={pauseToast}
      onMouseLeave={resumeToast}
      onFocus={pauseToast}
      onBlur={resumeToast}
      className="fixed bottom-6 left-1/2 z-50 flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-sm text-paper shadow-soft transition-transform duration-200"
    >
      <span className="font-medium text-paper">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action?.onClick();
            hideToast();
          }}
          className="rounded px-2 py-1 text-xs font-semibold uppercase tracking-wider text-accent-soft hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
        >
          {toast.action.label}
        </button>
      )}
      <button
        type="button"
        onClick={hideToast}
        aria-label="Dismiss notification"
        className="ml-1 grid size-7 place-items-center rounded-full text-mute hover:bg-white/10 hover:text-paper focus-visible:outline-2 focus-visible:outline-white"
      >
        <IconX width={14} height={14} />
      </button>
    </div>
  );
}

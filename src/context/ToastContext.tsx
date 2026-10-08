import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: string;
  message: string;
  action?: ToastAction;
}

interface ToastContextValue {
  toast: ToastData | null;
  showToast: (message: string, action?: ToastAction) => void;
  hideToast: () => void;
  pauseToast: () => void;
  resumeToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(TOAST_DURATION_MS);
  const startTimeRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const hideToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, []);

  const startTimer = useCallback((durationMs: number) => {
    clearTimer();
    startTimeRef.current = Date.now();
    remainingTimeRef.current = durationMs;
    timerRef.current = setTimeout(() => {
      setToast(null);
      timerRef.current = null;
    }, durationMs);
  }, []);

  const pauseToast = useCallback(() => {
    if (isPausedRef.current || !timerRef.current) return;
    isPausedRef.current = true;
    clearTimer();
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  }, []);

  const resumeToast = useCallback(() => {
    if (!isPausedRef.current) return;
    isPausedRef.current = false;
    if (remainingTimeRef.current > 0) {
      startTimer(remainingTimeRef.current);
    } else {
      hideToast();
    }
  }, [startTimer, hideToast]);

  const showToast = useCallback(
    (message: string, action?: ToastAction) => {
      // One toast at a time: clears any active toast/timer and replaces
      clearTimer();
      isPausedRef.current = false;
      const nextId = String(Date.now());
      setToast({ id: nextId, message, action });
      startTimer(TOAST_DURATION_MS);
    },
    [startTimer]
  );

  return (
    <ToastContext.Provider
      value={{
        toast,
        showToast,
        hideToast,
        pauseToast,
        resumeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

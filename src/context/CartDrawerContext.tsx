import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

interface CartDrawerContextValue {
  isOpen: boolean;
  openDrawer: (highlightId?: string) => void;
  closeDrawer: () => void;
  setIsOpen: (open: boolean) => void;
  lastAddedId: string | null;
}

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null);

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDrawer = useCallback((highlightId?: string) => {
    setIsOpen(true);
    if (highlightId) {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
      setLastAddedId(highlightId);
      highlightTimerRef.current = setTimeout(() => {
        setLastAddedId(null);
        highlightTimerRef.current = null;
      }, 1200);
    }
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CartDrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        setIsOpen,
        lastAddedId,
      }}
    >
      {children}
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer(): CartDrawerContextValue {
  const context = useContext(CartDrawerContext);
  if (!context) {
    throw new Error("useCartDrawer must be used within a CartDrawerProvider");
  }
  return context;
}

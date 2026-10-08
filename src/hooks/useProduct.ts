import { useCallback, useEffect, useState } from "react";
import { fetchProductById } from "../services/productService";
import type { Product } from "../types/product";

export type ProductStatus = "loading" | "error" | "success" | "not-found";

export interface UseProductResult {
  product: Product | null;
  status: ProductStatus;
  retry: () => void;
}

export function useProduct(id: string | undefined): UseProductResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<ProductStatus>(id ? "loading" : "not-found");
  const [attempt, setAttempt] = useState(0);
  const [prevKey, setPrevKey] = useState({ id, attempt: 0 });

  // Update status on key changes during render
  if (prevKey.id !== id || prevKey.attempt !== attempt) {
    setPrevKey({ id, attempt });
    setStatus(id ? "loading" : "not-found");
    if (!id) setProduct(null);
  }

  const retry = useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    fetchProductById(id)
      .then((item) => {
        if (cancelled) return;
        if (!item) {
          setProduct(null);
          setStatus("not-found");
        } else {
          setProduct(item);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  return { product, status, retry };
}

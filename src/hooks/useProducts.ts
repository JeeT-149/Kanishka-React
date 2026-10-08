import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import type { Product } from "../types/product";

export type ProductsStatus = "loading" | "error" | "success";

export interface UseProductsResult {
  products: Product[];
  status: ProductsStatus;
  retry: () => void;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<ProductsStatus>("loading");
  const [attempt, setAttempt] = useState(0);

  const retry = useCallback(() => {
    setAttempt((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    fetchProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
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
  }, [attempt]);

  return { products, status, retry };
}

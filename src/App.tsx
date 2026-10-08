import { RouterProvider } from "react-router";
import { CartProvider } from "./context/CartContext";
import { CartDrawerProvider } from "./context/CartDrawerContext";
import { ToastProvider } from "./context/ToastContext";
import { router } from "./router";

export default function App() {
  return (
    <CartProvider>
      <ToastProvider>
        <CartDrawerProvider>
          <RouterProvider router={router} />
        </CartDrawerProvider>
      </ToastProvider>
    </CartProvider>
  );
}

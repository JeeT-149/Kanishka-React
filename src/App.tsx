import { RouterProvider } from "react-router";
import { CartProvider } from "./context/CartContext";
import { CartDrawerProvider } from "./context/CartDrawerContext";
import { router } from "./router";

export default function App() {
  return (
    <CartProvider>
      <CartDrawerProvider>
        <RouterProvider router={router} />
      </CartDrawerProvider>
    </CartProvider>
  );
}

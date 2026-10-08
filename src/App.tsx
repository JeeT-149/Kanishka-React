import { RouterProvider, createHashRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import { CartProvider } from "./context/CartContext";
import { CartDrawerProvider } from "./context/CartDrawerContext";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default function App() {
  return (
    <CartProvider>
      <CartDrawerProvider>
        <RouterProvider router={router} />
      </CartDrawerProvider>
    </CartProvider>
  );
}

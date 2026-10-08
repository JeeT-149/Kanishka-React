import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
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

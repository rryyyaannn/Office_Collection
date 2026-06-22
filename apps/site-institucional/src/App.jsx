import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsappFloat from "./components/WhatsappFloat";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import SegmentPage from "./pages/SegmentPage";
import BlogIndex from "./pages/BlogIndex";
import Article from "./pages/Article";
import Checkout from "./pages/Checkout";
import Account from "./pages/Account";

/** Rola ao topo a cada troca de rota (respeita âncoras #secao na home). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <ScrollManager />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<CatalogPage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/segmento/:id" element={<SegmentPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/conta" element={<Account />} />
        </Routes>
      </main>
      <Footer />
      <WhatsappFloat />
      <CartDrawer />
    </div>
  );
}

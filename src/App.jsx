import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/shared/lib/cart";
import { AuthProvider } from "@/shared/lib/auth";
import ErrorBoundary from "@/shared/components/ErrorBoundary";

/* ---------- user side ---------- */
import Home from "@/user/pages/Index";
import Shop from "@/user/pages/Shop";
import Perfumes from "@/user/pages/Perfumes";
import Skincare from "@/user/pages/Skincare";
import Gifts from "@/user/pages/Gifts";
import ProductPage from "@/user/pages/ProductId";
import Cart from "@/user/pages/Cart";
import Checkout from "@/user/pages/Checkout";
import Wishlist from "@/user/pages/Wishlist";
import Journal from "@/user/pages/Journal";
import About from "@/user/pages/About";
import Faq from "@/user/pages/Faq";
import Contact from "@/user/pages/Contact";

/* ---------- admin side ---------- */
import AdminShell from "@/admin/components/AdminShell";
import AdminLogin from "@/admin/pages/AdminLogin";
import AdminDashboard from "@/admin/pages/AdminIndex";
import AdminProducts from "@/admin/pages/AdminProducts";
import AdminOrders from "@/admin/pages/AdminOrders";
import AdminCustomers from "@/admin/pages/AdminCustomers";
import AdminSellers from "@/admin/pages/AdminSellers";
import AdminMessages from "@/admin/pages/AdminMessages";
import AdminAnalytics from "@/admin/pages/AdminAnalytics";
import AdminSettings from "@/admin/pages/AdminSettings";

/* ---------- seller / artisan portal ---------- */
import SellerShell from "@/seller/components/SellerShell";
import SellerLogin from "@/seller/pages/SellerLogin";
import SellerIndex from "@/seller/pages/SellerIndex";
import SellerProducts from "@/seller/pages/SellerProducts";
import SellerOrders from "@/seller/pages/SellerOrders";
import SellerCustomers from "@/seller/pages/SellerCustomers";
import SellerSubscription from "@/seller/pages/SellerSubscription";

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="text-7xl font-display text-[#35104F]">404</h1>
        <p className="mt-3 text-muted-foreground text-sm">This page does not exist or has been moved.</p>
        <a href="/" className="mt-6 inline-block rounded-xl bg-royal px-6 py-2.5 text-xs uppercase tracking-wider text-primary-foreground font-semibold">
          Return to Atelier
        </a>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <Routes>
              {/* USER SIDE */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/perfumes" element={<Perfumes />} />
              <Route path="/skincare" element={<Skincare />} />
              <Route path="/gifts" element={<Gifts />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />

              {/* SELLER / ARTISAN PORTAL */}
              <Route path="/seller-login" element={<SellerLogin />} />
              <Route path="/seller" element={<SellerShell />}>
                <Route index element={<SellerIndex />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="orders" element={<SellerOrders />} />
                <Route path="customers" element={<SellerCustomers />} />
                <Route path="subscription" element={<SellerSubscription />} />
              </Route>

              {/* ADMIN SIDE */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminShell />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="sellers" element={<AdminSellers />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster position="top-center" />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

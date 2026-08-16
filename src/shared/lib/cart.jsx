import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/shared/lib/products";
const Ctx = createContext(null);
const KEY = "aura_cart";
const WKEY = "aura_wishlist";
function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    try {
      setLines(JSON.parse(localStorage.getItem(KEY) || "[]"));
      setWishlist(JSON.parse(localStorage.getItem(WKEY) || "[]"));
    } catch {
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);
  useEffect(() => {
    localStorage.setItem(WKEY, JSON.stringify(wishlist));
  }, [wishlist]);
  const value = useMemo(() => {
    const detailed = lines.map((l) => ({ product: products.find((p) => p.id === l.id), qty: l.qty })).filter((l) => l.product);
    return {
      lines,
      detailed,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: detailed.reduce((n, l) => n + l.product.price * l.qty, 0),
      add: (id, qty = 1) => setLines(
        (prev) => prev.some((l) => l.id === id) ? prev.map((l) => l.id === id ? { ...l, qty: l.qty + qty } : l) : [...prev, { id, qty }]
      ),
      setQty: (id, qty) => setLines((prev) => prev.flatMap((l) => l.id === id ? qty <= 0 ? [] : [{ ...l, qty }] : [l])),
      remove: (id) => setLines((prev) => prev.filter((l) => l.id !== id)),
      clear: () => setLines([]),
      wishlist,
      toggleWish: (id) => setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
    };
  }, [lines, wishlist]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
export {
  CartProvider,
  useCart
};

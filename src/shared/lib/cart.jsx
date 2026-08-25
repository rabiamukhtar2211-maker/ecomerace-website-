import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as seedProducts } from "@/shared/lib/products";
import api from "@/shared/services/api";

const Ctx = createContext(null);
const KEY = "aura_cart";
const WKEY = "aura_wishlist";

function CartProvider({ children }) {
  const [lines, setLines] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(WKEY) || "[]");
    } catch {
      return [];
    }
  });

  const [dbProducts, setDbProducts] = useState(seedProducts);

  // Fetch all live products from database on mount to populate catalogue cache
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await api.getProducts();
        if (res.products && res.products.length > 0) {
          const mapped = res.products.map((p) => ({
            id: p.slug || String(p.id),
            dbId: p.id,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            price: Number(p.price),
            oldPrice: p.old_price ? Number(p.old_price) : undefined,
            category: p.category,
            family: p.family || "Luxury",
            size: p.size || "100 ml",
            rating: Number(p.rating || 5.0),
            reviews: p.reviews || 0,
            stock: p.stock || 20,
            image: p.image || "/p-perfume-1.jpg",
            badge: p.badge,
            store_name: p.store_name,
            seller_name: p.seller_name,
            notes: Array.isArray(p.notes) ? p.notes : [],
          }));
          setDbProducts(mapped);
        }
      } catch (err) {
        console.warn("Cart catalogue fetch error:", err.message);
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    localStorage.setItem(WKEY, JSON.stringify(wishlist));
  }, [wishlist]);

  // Helper to find a product by ID, slug, or stored item
  const findProduct = (item) => {
    if (item.product && item.product.name) return item.product;

    const targetId = String(item.id);
    const foundInDb = dbProducts.find(
      (p) => String(p.id) === targetId || String(p.dbId) === targetId || p.slug === targetId
    );
    if (foundInDb) return foundInDb;

    const foundInSeed = seedProducts.find(
      (p) => String(p.id) === targetId || String(p.dbId) === targetId || p.slug === targetId
    );
    if (foundInSeed) return foundInSeed;

    return null;
  };

  const detailed = useMemo(() => {
    return lines
      .map((l) => {
        const product = findProduct(l);
        return {
          product: product || {
            id: l.id,
            name: l.product?.name || `Artisan Fragrance (${l.id})`,
            price: Number(l.product?.price) || 98.0,
            image: l.product?.image || "/p-perfume-1.jpg",
            family: l.product?.family || "Luxury",
            size: l.product?.size || "100 ml",
            store_name: l.product?.store_name || "Lumière Atelier",
          },
          qty: l.qty,
        };
      })
      .filter((l) => l.qty > 0);
  }, [lines, dbProducts]);

  const subtotal = useMemo(() => {
    return detailed.reduce((n, l) => n + Number(l.product.price) * l.qty, 0);
  }, [detailed]);

  const count = useMemo(() => {
    return lines.reduce((n, l) => n + l.qty, 0);
  }, [lines]);

  const add = (productOrId, qty = 1) => {
    if (!productOrId) return;

    let id;
    let productData = null;

    if (typeof productOrId === "object") {
      id = productOrId.id || productOrId.slug || String(productOrId.dbId);
      productData = productOrId;
    } else {
      id = String(productOrId);
      productData = findProduct({ id });
    }

    setLines((prev) => {
      const exists = prev.some((l) => String(l.id) === String(id));
      if (exists) {
        return prev.map((l) =>
          String(l.id) === String(id)
            ? { ...l, qty: l.qty + qty, product: productData || l.product }
            : l
        );
      } else {
        return [...prev, { id, qty, product: productData }];
      }
    });
  };

  const setQty = (id, qty) => {
    const targetId = String(id);
    setLines((prev) =>
      prev.flatMap((l) =>
        String(l.id) === targetId ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l]
      )
    );
  };

  const remove = (id) => {
    const targetId = String(id);
    setLines((prev) => prev.filter((l) => String(l.id) !== targetId));
  };

  const clear = () => setLines([]);

  const toggleWish = (id) => {
    const targetId = String(id);
    setWishlist((prev) =>
      prev.includes(targetId) ? prev.filter((x) => x !== targetId) : [...prev, targetId]
    );
  };

  const value = {
    lines,
    detailed,
    count,
    subtotal,
    add,
    setQty,
    remove,
    clear,
    wishlist,
    toggleWish,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export { CartProvider, useCart };

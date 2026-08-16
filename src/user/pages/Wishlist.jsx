import { Link } from "@/shared/lib/router";
import SiteLayout from "@/user/components/SiteLayout";
import ProductCard from "@/user/components/ProductCard";
import { products } from "@/shared/lib/products";
import { useCart } from "@/shared/lib/cart";
function Wishlist() {
  const { wishlist } = useCart();
  const saved = products.filter((p) => wishlist.includes(p.id));
  return <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 py-14">
        <h1 className="text-4xl">Saved for later</h1>
        {saved.length === 0 ? <div className="card-lux mt-10 p-16 text-center">
            <p className="text-muted-foreground">Nothing saved yet — tap the heart on any product.</p>
            <Link to="/shop" className="mt-6 inline-block rounded-md bg-royal px-7 py-3 text-[0.7rem] tracking-[0.2em] text-primary-foreground uppercase">
              Browse collection
            </Link>
          </div> : <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {saved.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>}
      </div>
    </SiteLayout>;
}
var stdin_default = Wishlist;
export {
  stdin_default as default
};

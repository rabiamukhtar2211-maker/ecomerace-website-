import ShopGrid from "@/user/components/ShopGrid";
import SiteLayout from "@/user/components/SiteLayout";
function Shop() {
  return <SiteLayout>
      <ShopGrid
    title="The Full Collection"
    subtitle="Thirty compositions across fragrance, skincare and gifting — each blended in small batches."
  />
    </SiteLayout>;
}
var stdin_default = Shop;
export {
  stdin_default as default
};

import ShopGrid from "@/user/components/ShopGrid";
import SiteLayout from "@/user/components/SiteLayout";
function Gifts() {
  return <SiteLayout>
      <ShopGrid
    title="Gifting"
    subtitle="Presented in lacquered violet boxes with silk ribbon and a handwritten card."
    category="Gift Set"
  />
    </SiteLayout>;
}
var stdin_default = Gifts;
export {
  stdin_default as default
};

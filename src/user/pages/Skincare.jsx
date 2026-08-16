import ShopGrid from "@/user/components/ShopGrid";
import SiteLayout from "@/user/components/SiteLayout";
function Skincare() {
  return <SiteLayout>
      <ShopGrid
    title="Skin Rituals"
    subtitle="Clinically dosed actives in gentle textures — for a barrier that glows on its own."
    category="Skincare"
  />
    </SiteLayout>;
}
var stdin_default = Skincare;
export {
  stdin_default as default
};

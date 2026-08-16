import ShopGrid from "@/user/components/ShopGrid";
import SiteLayout from "@/user/components/SiteLayout";
function Perfumes() {
  return <SiteLayout>
      <ShopGrid
    title="Parfums"
    subtitle="Concentrated extraits and eaux de parfum, matured for six weeks before bottling."
    category="Perfume"
  />
    </SiteLayout>;
}
var stdin_default = Perfumes;
export {
  stdin_default as default
};

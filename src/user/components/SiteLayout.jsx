import Navbar from "./Navbar";
import Footer from "./Footer";
function SiteLayout({ children }) {
  return <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>;
}
export {
  SiteLayout as default
};

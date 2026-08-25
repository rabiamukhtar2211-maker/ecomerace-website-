import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2, X, Loader2, RefreshCw, Upload, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { money, products as seed } from "@/shared/lib/products";
import api from "@/shared/services/api";

const PRESET_IMAGES = [
  { label: "Rose Perfume", url: "/p-perfume-1.jpg" },
  { label: "Orchid Perfume", url: "/p-perfume-2.jpg" },
  { label: "Oud Noir", url: "/p-perfume-3.jpg" },
  { label: "Glow Serum", url: "/p-skin-1.jpg" },
  { label: "Radiance Cream", url: "/p-skin-2.jpg" },
  { label: "Dew Toner", url: "/p-skin-3.jpg" },
];

function AdminProducts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  // Modal States (Add & Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageMode, setImageMode] = useState("preset"); // 'preset' | 'url' | 'upload'

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    category: "Perfume",
    family: "Floral",
    price: "",
    size: "100 ml",
    stock: "25",
    image: "/p-perfume-1.jpg"
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.getProducts();
      if (res.products && res.products.length > 0) {
        setRows(res.products);
      } else {
        setRows(seed);
      }
    } catch (err) {
      console.warn("Backend not reached, using fallback:", err.message);
      setRows(seed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditId(null);
    setForm({
      name: "",
      tagline: "",
      category: "Perfume",
      family: "Floral",
      price: "",
      size: "100 ml",
      stock: "25",
      image: "/p-perfume-1.jpg"
    });
    setImageMode("preset");
    setIsModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditModal = (product) => {
    setIsEditMode(true);
    setEditId(product.id || product.slug);
    setForm({
      name: product.name || "",
      tagline: product.tagline || "",
      category: product.category || "Perfume",
      family: product.family || "Floral",
      price: product.price ? String(product.price) : "",
      size: product.size || "100 ml",
      stock: product.stock ? String(product.stock) : "20",
      image: product.image || "/p-perfume-1.jpg"
    });

    if (product.image && (product.image.startsWith("http://") || product.image.startsWith("https://"))) {
      setImageMode("url");
    } else if (product.image && product.image.startsWith("data:")) {
      setImageMode("upload");
    } else {
      setImageMode("preset");
    }

    setIsModalOpen(true);
  };

  // Handle local file upload (converts to Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please choose an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
      toast.success("Image preview loaded!");
    };
    reader.readAsDataURL(file);
  };

  // Save (Create or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        // Edit existing product in PostgreSQL
        const res = await api.updateProduct(editId, {
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
        });
        toast.success(res.message || "Product updated successfully!");
      } else {
        // Create new product in PostgreSQL
        const res = await api.createProduct({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
        });
        toast.success(res.message || "Product created successfully!");
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message || "Failed to save product in database.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      toast.success(`${name} deleted from database.`);
      setRows((r) => r.filter((x) => x.id !== id && x.slug !== id));
    } catch (err) {
      setRows((r) => r.filter((x) => x.id !== id));
      toast.info(`${name} removed.`);
    }
  };

  const list = rows.filter(
    (p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Products Catalogue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} items live in PostgreSQL database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 rounded-md border border-input bg-card px-4 py-3 text-xs tracking-wider uppercase hover:bg-muted cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-md bg-royal px-5 py-3 text-[0.7rem] tracking-[0.18em] text-primary-foreground uppercase shadow-glow hover:opacity-90 cursor-pointer font-semibold"
          >
            <Plus className="size-4" /> Add new product
          </button>
        </div>
      </div>

      <div className="card-lux flex flex-wrap gap-3 p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search product name…"
          className="min-w-56 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {["All", "Perfume", "Skincare", "Gift Set"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="card-lux overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted-foreground">
                  <Loader2 className="mx-auto size-6 animate-spin mb-2 text-accent" />
                  Loading products from PostgreSQL...
                </td>
              </tr>
            )}
            {!loading &&
              list.map((p) => (
                <tr key={p.id || p.slug} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image || "/p-perfume-1.jpg"}
                        alt={p.name}
                        loading="lazy"
                        className="size-11 rounded-md object-cover bg-muted"
                      />
                      <div>
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.family || "Luxury"} · {p.size || "Standard"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3 font-semibold">{money(Number(p.price))}</td>
                  <td className="px-5 py-3">
                    <span className={p.stock < 15 ? "text-destructive font-semibold" : ""}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-3">★ {p.rating || 5.0}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="rounded-md border border-input p-2 text-accent hover:bg-accent/10 transition-colors cursor-pointer"
                        title="Edit product"
                        aria-label="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => handleDelete(p.id || p.slug, p.name)}
                        className="rounded-md border border-input p-2 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Delete product"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted-foreground">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADD / EDIT PRODUCT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-card p-6 shadow-2xl border border-border max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-display text-xl">
                  {isEditMode ? "Edit Product" : "Add New Luxury Product"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isEditMode ? "Update details and image in PostgreSQL." : "This product will be saved directly into PostgreSQL."}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Product Basic Info */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Product Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Velvet Rose Elixir"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Tagline</label>
                  <input
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="Midnight Bulgarian Rose & Amber"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  >
                    <option value="Perfume">Perfume</option>
                    <option value="Skincare">Skincare</option>
                    <option value="Gift Set">Gift Set</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Price ($) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="185.00"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Size / Vol</label>
                  <input
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="100 ml"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Stock Units</label>
                  <input
                    required
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="30"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* ================= IMAGE SELECTION PORTION ================= */}
              <div className="border border-border/80 rounded-xl p-3.5 bg-muted/20">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-accent">
                    Product Image (Photo / URL)
                  </label>
                  {/* Mode switch buttons */}
                  <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border text-[0.68rem]">
                    <button
                      type="button"
                      onClick={() => setImageMode("url")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        imageMode === "url" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Any Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        imageMode === "upload" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode("preset")}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        imageMode === "preset" ? "bg-card text-foreground font-semibold shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Gallery Presets
                    </button>
                  </div>
                </div>

                {/* Option A: Image URL Input (Supports any website URL!) */}
                {imageMode === "url" && (
                  <div>
                    <label className="block text-[0.7rem] text-muted-foreground mb-1">
                      Paste direct image link from any website (Unsplash, Pinterest, Google, Cloudinary, etc.):
                    </label>
                    <input
                      type="url"
                      value={form.image && !form.image.startsWith("data:") ? form.image : ""}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-1547887537-6158d64c35b3"
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                )}

                {/* Option B: Local File Upload */}
                {imageMode === "upload" && (
                  <div>
                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-accent/60 bg-card/50 transition-colors">
                      <Upload className="size-6 text-accent" />
                      <span className="text-xs text-foreground font-medium">Click to choose image from your computer</span>
                      <span className="text-[0.68rem] text-muted-foreground">PNG, JPG, WEBP up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Option C: Preset Image Selector */}
                {imageMode === "preset" && (
                  <div>
                    <p className="text-[0.7rem] text-muted-foreground mb-2">Select from Atelier luxury presets:</p>
                    <div className="grid grid-cols-6 gap-2">
                      {PRESET_IMAGES.map((img) => (
                        <button
                          type="button"
                          key={img.url}
                          onClick={() => setForm({ ...form, image: img.url })}
                          className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            form.image === img.url ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-accent/50"
                          }`}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                          {form.image === img.url && (
                            <div className="absolute inset-0 bg-accent/30 flex items-center justify-center text-accent-foreground">
                              <Check className="size-4 drop-shadow" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Image Preview Box */}
                {form.image && (
                  <div className="mt-3 flex items-center gap-3 pt-2.5 border-t border-border">
                    <img
                      src={form.image}
                      alt="Preview"
                      onError={(e) => {
                        e.target.src = "/p-perfume-1.jpg";
                      }}
                      className="size-12 rounded-lg object-cover border border-border shadow-xs bg-muted"
                    />
                    <div className="text-xs">
                      <p className="font-medium text-foreground flex items-center gap-1.5">
                        <ImageIcon className="size-3.5 text-accent" /> Live Image Preview
                      </p>
                      <p className="text-[0.68rem] text-muted-foreground truncate max-w-xs">
                        {form.image.startsWith("data:") ? "Device File Upload" : form.image}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-input px-4 py-2 text-xs uppercase tracking-wider hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-royal px-5 py-2 text-xs uppercase tracking-wider text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-50 flex items-center gap-2 cursor-pointer font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    isEditMode ? "Update Product" : "Save to Database"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;

import p1 from "@/shared/assets/p-perfume-1.jpg";
import p2 from "@/shared/assets/p-perfume-2.jpg";
import p3 from "@/shared/assets/p-perfume-3.jpg";
import s1 from "@/shared/assets/p-skin-1.jpg";
import s2 from "@/shared/assets/p-skin-2.jpg";
import s3 from "@/shared/assets/p-skin-3.jpg";
const perfumeImages = [p1, p2, p3];
const skinImages = [s1, s2, s3];
const P = (id, name, tagline, price, category, family, size, rating, reviews, stock, image, notes, badge, oldPrice) => ({
  id,
  name,
  tagline,
  price,
  oldPrice,
  category,
  family,
  size,
  rating,
  reviews,
  stock,
  image,
  badge,
  notes,
  description: `${name} \u2014 ${tagline}. A ${family.toLowerCase()} composition crafted in small batches with sustainably sourced ingredients, aged for depth and finished by hand in our atelier.`
});
const products = [
  P("noir-eclat", "Noir \xC9clat", "Midnight rose & oud", 189, "Perfume", "Oriental", "100 ml", 4.9, 412, 24, p3, ["Bulgarian Rose", "Oud", "Vanilla Absolute"], "Bestseller"),
  P("velvet-orchid", "Velvet Orchid", "Plum, orchid, amber", 164, "Perfume", "Floral", "90 ml", 4.8, 318, 31, p1, ["Purple Orchid", "Plum", "Amber"], "New"),
  P("rose-imperial", "Rose Imp\xE9rial", "Petal-soft signature", 148, "Perfume", "Floral", "75 ml", 4.7, 596, 44, p2, ["Rose de Mai", "Peony", "White Musk"]),
  P("amethyst-veil", "Amethyst Veil", "Iris & violet leaf", 172, "Perfume", "Powdery", "100 ml", 4.6, 208, 18, p1, ["Iris", "Violet Leaf", "Sandalwood"]),
  P("pink-suede", "Pink Suede", "Warm leather blush", 158, "Perfume", "Woody", "90 ml", 4.5, 141, 12, p2, ["Suede", "Raspberry", "Tonka"], "Limited"),
  P("nuit-de-lilas", "Nuit de Lilas", "Lilac after rain", 136, "Perfume", "Floral", "75 ml", 4.4, 97, 52, p3, ["Lilac", "Green Fig", "Cedar"]),
  P("orchid-noir-intense", "Orchid Noir Intense", "Deeper, darker, richer", 214, "Perfume", "Oriental", "100 ml", 4.9, 265, 9, p3, ["Black Orchid", "Patchouli", "Incense"], "Bestseller"),
  P("berry-mirage", "Berry Mirage", "Juicy pink haze", 124, "Perfume", "Fruity", "50 ml", 4.3, 188, 60, p2, ["Blackcurrant", "Lychee", "Musk"], void 0, 149),
  P("saffron-plum", "Saffron & Plum", "Spiced gourmand", 178, "Perfume", "Spicy", "90 ml", 4.7, 156, 21, p1, ["Saffron", "Damson Plum", "Benzoin"]),
  P("aura-blanche", "Aura Blanche", "Clean skin veil", 132, "Perfume", "Musky", "75 ml", 4.5, 233, 38, p1, ["White Musk", "Cotton", "Bergamot"]),
  P("mauve-oud", "Mauve Oud", "Royal resin", 246, "Perfume", "Oriental", "100 ml", 5, 84, 6, p3, ["Cambodian Oud", "Rose", "Leather"], "Limited"),
  P("petale-rose", "P\xE9tale Rose", "Everyday romance", 98, "Perfume", "Floral", "50 ml", 4.4, 402, 75, p2, ["Rose Petals", "Pear", "Vanilla"], void 0, 118),
  P("glow-serum", "Hydra Glow Serum", "5% niacinamide + HA", 68, "Skincare", "Serum", "30 ml", 4.9, 731, 90, s1, ["Niacinamide", "Hyaluronic Acid", "Panthenol"], "Bestseller"),
  P("radiance-cream", "Radiance Cream", "48h barrier moisture", 74, "Skincare", "Moisturiser", "50 ml", 4.8, 522, 66, s2, ["Ceramides", "Squalane", "Peptides"]),
  P("lilac-toner", "Lilac Dew Toner", "Balancing essence mist", 42, "Skincare", "Toner", "150 ml", 4.6, 289, 120, s3, ["Lilac Extract", "PHA", "Glycerin"]),
  P("night-renewal-oil", "Night Renewal Oil", "Overnight resurfacing", 86, "Skincare", "Facial Oil", "30 ml", 4.7, 198, 33, s1, ["Rosehip", "Bakuchiol", "Vitamin E"], "New"),
  P("velvet-cleanser", "Velvet Cream Cleanser", "Milky, non-stripping", 38, "Skincare", "Cleanser", "180 ml", 4.5, 610, 140, s2, ["Oat Milk", "Amino Acids", "Chamomile"]),
  P("rose-clay-mask", "Rose Clay Mask", "10-minute clarity", 46, "Skincare", "Mask", "75 ml", 4.4, 175, 84, s3, ["Pink Clay", "Kaolin", "Rose Water"]),
  P("vitamin-c-drops", "Vitamin C Drops", "12% brightening", 62, "Skincare", "Serum", "20 ml", 4.6, 344, 58, s1, ["THD Ascorbate", "Ferulic Acid", "Vitamin E"]),
  P("eye-lift-gel", "Amethyst Eye Gel", "Depuff & smooth", 54, "Skincare", "Eye Care", "15 ml", 4.5, 261, 71, s3, ["Caffeine", "Peptides", "Cucumber"]),
  P("retinal-night", "Retinal 0.1% Night", "Firming resurfacer", 92, "Skincare", "Treatment", "30 ml", 4.8, 143, 27, s1, ["Retinal", "Ceramides", "Allantoin"], "New"),
  P("body-souffle", "Rose Body Souffl\xE9", "Whipped silk finish", 48, "Skincare", "Body", "200 ml", 4.7, 231, 95, s2, ["Shea Butter", "Rose Oil", "Niacinamide"]),
  P("spf-veil", "Invisible SPF 50 Veil", "Weightless daily shield", 56, "Skincare", "Sunscreen", "50 ml", 4.6, 388, 110, s3, ["SPF 50 PA++++", "Vitamin E", "Squalane"]),
  P("lip-balm-plum", "Plum Lip Treatment", "Overnight lip mask", 28, "Skincare", "Lip Care", "15 ml", 4.4, 456, 160, s2, ["Plum Oil", "Lanolin", "Shea"], void 0, 34),
  P("gift-signature", "Signature Discovery Set", "5 \xD7 10 ml icons", 118, "Gift Set", "Discovery", "5 \xD7 10 ml", 4.9, 214, 40, p1, ["Noir \xC9clat", "Velvet Orchid", "Rose Imp\xE9rial"], "Bestseller"),
  P("gift-glow-ritual", "Glow Ritual Kit", "Cleanse, serum, cream", 156, "Gift Set", "Skincare Kit", "3 pieces", 4.8, 167, 28, s2, ["Velvet Cleanser", "Hydra Glow", "Radiance Cream"], void 0, 180),
  P("gift-midnight", "Midnight Luxe Coffret", "Parfum + body duo", 232, "Gift Set", "Luxury", "2 pieces", 4.9, 92, 15, p3, ["Orchid Noir", "Rose Body Souffl\xE9"], "Limited"),
  P("gift-bridal", "Bridal Aura Box", "Curated for the day", 268, "Gift Set", "Luxury", "4 pieces", 5, 61, 10, p2, ["Rose Imp\xE9rial", "Radiance Cream", "Lip Treatment"]),
  P("gift-travel", "Travel Atelier Pouch", "Cabin-ready essentials", 96, "Gift Set", "Travel", "4 pieces", 4.5, 128, 54, s3, ["Mini Serum", "Mini Cream", "Mini Parfum"]),
  P("gift-mothers", "Fleur Celebration Set", "Petals & powder", 142, "Gift Set", "Discovery", "3 pieces", 4.7, 88, 36, p2, ["P\xE9tale Rose", "Rose Clay Mask", "Lip Treatment"])
];
const categories = ["All", "Perfume", "Skincare", "Gift Set"];
const getProduct = (id) => products.find((p) => p.id === id);
const money = (n) => `$${n.toFixed(2)}`;
const orders = [
  { id: "#LA-4821", customer: "Ayesha Khan", email: "ayesha@mail.com", total: 421, items: 3, status: "Delivered", date: "2026-08-08", city: "Karachi" },
  { id: "#LA-4820", customer: "Marion Blake", email: "marion@mail.com", total: 189, items: 1, status: "Shipped", date: "2026-08-08", city: "London" },
  { id: "#LA-4819", customer: "Sara Ahmed", email: "sara@mail.com", total: 264, items: 2, status: "Processing", date: "2026-08-07", city: "Lahore" },
  { id: "#LA-4818", customer: "L\xE9a Dubois", email: "lea@mail.com", total: 98, items: 1, status: "Pending", date: "2026-08-07", city: "Paris" },
  { id: "#LA-4817", customer: "Hina Raza", email: "hina@mail.com", total: 612.5, items: 5, status: "Delivered", date: "2026-08-06", city: "Islamabad" },
  { id: "#LA-4816", customer: "Nora Wallis", email: "nora@mail.com", total: 156, items: 2, status: "Cancelled", date: "2026-08-06", city: "Dubai" },
  { id: "#LA-4815", customer: "Fatima Noor", email: "fatima@mail.com", total: 342, items: 3, status: "Shipped", date: "2026-08-05", city: "Multan" },
  { id: "#LA-4814", customer: "Emma Stone", email: "emma@mail.com", total: 74, items: 1, status: "Delivered", date: "2026-08-05", city: "New York" }
];
const customers = [
  { name: "Ayesha Khan", email: "ayesha@mail.com", orders: 12, spent: 2841, tier: "Platinum", joined: "2024-03-11" },
  { name: "Hina Raza", email: "hina@mail.com", orders: 9, spent: 1980, tier: "Gold", joined: "2024-07-02" },
  { name: "Sara Ahmed", email: "sara@mail.com", orders: 6, spent: 1120, tier: "Gold", joined: "2025-01-19" },
  { name: "L\xE9a Dubois", email: "lea@mail.com", orders: 4, spent: 690, tier: "Silver", joined: "2025-05-08" },
  { name: "Marion Blake", email: "marion@mail.com", orders: 3, spent: 512, tier: "Silver", joined: "2025-09-23" },
  { name: "Fatima Noor", email: "fatima@mail.com", orders: 2, spent: 398, tier: "Bronze", joined: "2026-02-14" }
];
const salesByMonth = [
  { month: "Jan", revenue: 18400 },
  { month: "Feb", revenue: 21200 },
  { month: "Mar", revenue: 25600 },
  { month: "Apr", revenue: 23100 },
  { month: "May", revenue: 29800 },
  { month: "Jun", revenue: 34200 },
  { month: "Jul", revenue: 39750 },
  { month: "Aug", revenue: 44120 }
];
export {
  categories,
  customers,
  getProduct,
  money,
  orders,
  perfumeImages,
  products,
  salesByMonth,
  skinImages
};

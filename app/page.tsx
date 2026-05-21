"use client";

import { useEffect, useState, type Dispatch, type SetStateAction, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  MessageCircle,
  MapPin,
  Plus,
  Minus,
  Trash2,
  BarChart3,
  Settings,
  Package,
  Lock,
  Download,
  FileText,
  Sparkles,
  Truck,
  Shirt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import negro from "@/lib/images/negro.png";
import vintage from "@/lib/images/vintage.png";
import cargo from "@/lib/images/cargo.png";

const initialProducts = [
  {
    id: 1,
    name: "Remera Básica",
    category: "Línea Urban",
    price: 65000,
    cost: 35000,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop",
    desc: "Remera básica de calce cómodo, ideal para uso diario.",
    composition: "Algodón premium, costura reforzada y terminación limpia.",
    sizes: { S: 8, M: 12, L: 10, XL: 5 },
    clicks: 124,
  },
  {
    id: 2,
    name: "Jogger Negro Comfort",
    category: "Línea Urban",
    price: 95000,
    cost: 52000,
    image: negro,
    desc: "Jogger moderno de cintura ajustable y terminación premium.",
    composition: "Frisa liviana, elástico reforzado y bolsillos laterales.",
    sizes: { S: 4, M: 6, L: 5, XL: 3 },
    clicks: 98,
  },
  {
    id: 3,
    name: "Sudadera",
    category: "Línea Urban",
    price: 125000,
    cost: 76000,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=900&auto=format&fit=crop",
    desc: "Sudadera urbana para combinar con remeras y joggers.",
    composition: "Tela suave, capucha doble y bolsillo frontal.",
    sizes: { S: 5, M: 7, L: 4, XL: 2 },
    clicks: 152,
  },

  {
    id: 5,
    name: "Palazo Elegance",
    category: "Línea Casual Femenina",
    price: 110000,
    cost: 66000,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
    desc: "Palazo de caída elegante, cómodo y versátil.",
    composition: "Tela fluida, pretina cómoda y acabado premium.",
    sizes: { S: 2, M: 2, L: 3, XL: 1 },
    clicks: 112,
  },
  {
    id: 9,
    name: "Jogger Cargo",
    category: "Línea Urban",
    price: 98000,
    cost: 54000,
    image: cargo,
    desc: "Jogger con bolsillos laterales estilo cargo.",
    composition: "Drill suave con refuerzos en costuras.",
    sizes: { S: 4, M: 7, L: 6, XL: 3 },
    clicks: 37,
  },
  {
    id: 10,
    name: "Remera Oversize Vintage",
    category: "Línea Urban",
    price: 48000,
    cost: 25000,
    image: vintage,
    desc: "Remera de corte oversize con lavado vintage.",
    composition: "Algodón peinado lavado.",
    sizes: { S: 6, M: 10, L: 12, XL: 8 },
    clicks: 55,
  }
];

const sections = ["Inicio", "Nosotros", "Productos", "Tienda Online", "Contacto"];
const zones = [
  { city: "Itauguá", delivery: 10000 },
  { city: "Capiatá", delivery: 15000 },
  { city: "San Lorenzo", delivery: 18000 },
  { city: "Luque", delivery: 20000 },
  { city: "Asunción", delivery: 25000 },
  { city: "Otra zona", delivery: 30000 },
];

type ProductSize = Record<string, number>;

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  cost: number;
  image: string | { src: string };
  desc: string;
  composition: string;
  sizes: ProductSize;
  clicks: number;
}

const getImageUrl = (image: string | { src: string }): string => {
  return typeof image === 'string' ? image : image.src;
};

interface CartItem {
  key: string;
  id: number;
  name: string;
  size: string;
  price: number;
  qty: number;
}

interface Zone {
  city: string;
  delivery: number;
}

type SetSection = Dispatch<SetStateAction<number>>;
type SetSelected = Dispatch<SetStateAction<Product | null>>;
type SetProducts = Dispatch<SetStateAction<Product[]>>;

type SetCart = Dispatch<SetStateAction<CartItem[]>>;

const gs = (n: number) =>
  new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(n);

const fade = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function IFConfeccionesWeb() {
  const [splash, setSplash] = useState(true);
  const [section, setSection] = useState(0);
  const [menu, setMenu] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [zone, setZone] = useState<Zone>(zones[0]);
  const [client, setClient] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [login, setLogin] = useState<{ user: string; pass: string }>({ user: "", pass: "" });
  const [accent, setAccent] = useState<string>("#c5a15a");
  const [banner, setBanner] = useState<string>("Envío gratis los miércoles en zonas seleccionadas de Central");

  // Funciones para actualizar estado y localStorage sincronicamente
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    if (typeof window !== "undefined") {
      localStorage.setItem("if_products_v2", JSON.stringify(newProducts));
    }
  };

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("if_cart", JSON.stringify(newCart));
    }
  };

  const updateAccent = (newAccent: string) => {
    setAccent(newAccent);
    if (typeof window !== "undefined") {
      localStorage.setItem("if_accent", newAccent);
    }
  };

  const updateBanner = (newBanner: string) => {
    setBanner(newBanner);
    if (typeof window !== "undefined") {
      localStorage.setItem("if_banner", newBanner);
    }
  };

  useEffect(() => {
    setTimeout(() => setSplash(false), 1600);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedProducts = localStorage.getItem("if_products");
    if (savedProducts) {
      const saved = JSON.parse(savedProducts);
      const merged = saved.map((p: Product) => {
        const initial = initialProducts.find((ip) => ip.id === p.id);
        return initial ? { ...p, image: initial.image } : p;
      });
      setProducts(merged);
    }

    const savedCart = localStorage.getItem("if_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedAccent = localStorage.getItem("if_accent");
    if (savedAccent) setAccent(savedAccent);

    const savedBanner = localStorage.getItem("if_banner");
    if (savedBanner) setBanner(savedBanner);
  }, []);

  const filtered = products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  const subtotal = cart.reduce((a: number, i: CartItem) => a + i.price * i.qty, 0);
  const total = subtotal + zone.delivery;
  const top = [...products].sort((a, b) => b.clicks - a.clicks).slice(0, 4);
  const margin = products.reduce((a: number, p: Product) => a + (p.price - p.cost), 0);

  const addCart = (product: Product, size: string) => {
    const key = `${product.id}-${size}`;
    const newCart = (() => {
      const found = cart.find((i) => i.key === key);
      if (found) return cart.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...cart, { key, id: product.id, name: product.name, size, price: product.price, qty: 1 }];
    })();
    updateCart(newCart);
    setCartOpen(true);
  };

  const removeItem = (key: string) => updateCart(cart.filter((i) => i.key !== key));

  const waOrder = () => {
    const order = cart.map((i) => `${i.name} (${i.size}) x${i.qty}`).join("\n");
    const text = `🛍️ ORDEN CONFIRMADA - IF Confecciones\n\n👤 Cliente: ${client || "Sin nombre"}\n📍 Ubicación: ${address || zone.city}\n\n📦 Pedido:\n${order}\n\n🚚 Envío: ${gs(zone.delivery)}\n💰 TOTAL: ${gs(total)}\n\nQuiero confirmar mi compra.`;
    window.open(`https://wa.me/595976689727?text=${encodeURIComponent(text)}`, "_blank");
  };

  const exportCSV = () => {
    const rows = [["Producto", "Categoria", "Precio", "Costo", "Margen", "Clicks"], ...products.map((p) => [p.name, p.category, p.price, p.cost, p.price - p.cost, p.clicks])];
    const blob = new Blob([rows.map((r) => r.join(";")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "IF_Confecciones_BI.csv";
    a.click();
  };

  if (splash) {
    return (
      <div className="h-screen bg-[#0f0f10] text-white flex items-center justify-center overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.85, filter: "blur(14px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} className="text-center">
          <div className="font-serif text-8xl font-black"><span>I</span><span style={{ color: accent }}>F</span></div>
          <p className="tracking-[0.45em] text-xs uppercase mt-4">Confecciones</p>
          <motion.div className="h-[2px] bg-white/70 mt-6" initial={{ width: 0 }} animate={{ width: 220 }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white overflow-x-hidden" style={{ "--accent": accent } as CSSProperties}>
      <header className="fixed top-0 left-0 right-0 z-40 px-5 md:px-10 py-4 flex items-center justify-between bg-[#0f0f10]/70 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => setSection(0)} className="flex items-center gap-3">
          <div className="font-serif text-3xl font-black">I<span style={{ color: accent }}>F</span></div>
          <div className="hidden sm:block text-left"><p className="text-xs tracking-[0.35em] uppercase">Confecciones</p><p className="text-[11px] text-white/50">Itauguá · Paraguay</p></div>
        </button>
        <nav className="hidden lg:flex items-center gap-2">
          {sections.map((s, i) => <Button key={s} variant="ghost" onClick={() => setSection(i)} className={section === i ? "text-[var(--accent)]" : "text-white/70"}>{s}</Button>)}
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCartOpen(true)} className="rounded-full bg-white text-black hover:bg-white/90"><ShoppingBag size={18} /> {cart.length}</Button>
          <Button onClick={() => setAdminOpen(true)} variant="outline" className="rounded-full border-white/20 bg-white/5"><Lock size={16} /></Button>
          <Button onClick={() => setMenu(true)} variant="ghost" className="lg:hidden"><Menu /></Button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main key={section} initial={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.02, filter: "blur(12px)" }} transition={{ duration: 0.45 }} className="min-h-screen pt-20">
          {section === 0 && <Home setSection={setSection} accent={accent} banner={banner} />}
          {section === 1 && <About />}
          {section === 2 && <Products products={products} setSelected={setSelected} addCart={addCart} />}
          {section === 3 && <Shop products={filtered} query={query} setQuery={setQuery} setSelected={setSelected} addCart={addCart} />}
          {section === 4 && <Contact />}
        </motion.main>
      </AnimatePresence>

      <SideMenu open={menu} setOpen={setMenu} setSection={setSection} />
      <Cart open={cartOpen} setOpen={setCartOpen} cart={cart} setCart={updateCart} removeItem={removeItem} subtotal={subtotal} total={total} zone={zone} setZone={setZone} client={client} setClient={setClient} address={address} setAddress={setAddress} waOrder={waOrder} />
      <ProductModal selected={selected} setSelected={setSelected} addCart={addCart} products={products} />
      <Admin open={adminOpen} setOpen={setAdminOpen} auth={auth} setAuth={setAuth} login={login} setLogin={setLogin} products={products} setProducts={updateProducts} top={top} margin={margin} accent={accent} setAccent={updateAccent} banner={banner} setBanner={updateBanner} exportCSV={exportCSV} />
    </div>
  );
}

function Home({ setSection, accent, banner }: { setSection: SetSection; accent: string; banner: string }) {
  return <section className="h-full grid lg:grid-cols-2 gap-8 px-6 md:px-12 items-center bg-[radial-gradient(circle_at_70%_30%,rgba(197,161,90,0.22),transparent_35%)]">
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-7">
      <motion.p variants={fade} className="text-xs tracking-[0.45em] uppercase" style={{ color: accent }}>Moda urbana confeccionada en Itauguá</motion.p>
      <motion.h1 variants={fade} className="font-serif text-5xl md:text-8xl leading-none">Calidad que se diseña,<br /><span style={{ color: accent }}>comodidad</span> que se viste.</motion.h1>
      <motion.p variants={fade} className="text-white/65 max-w-xl">Una experiencia de compra premium, rápida y directa por WhatsApp. Remeras, joggers, sudaderas, blusas y palazos con estética limpia y confección industrial.</motion.p>
      <motion.div variants={fade} className="flex flex-wrap gap-3">
        <MagneticButton onClick={() => setSection(3)}>Comprar ahora</MagneticButton>
        <Button onClick={() => setSection(2)} variant="outline" className="rounded-full border-white/20 bg-white/5">Ver catálogo</Button>
      </motion.div>
    </motion.div>
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="relative hidden lg:block">
      <img loading="lazy" className="h-[72vh] w-full object-cover rounded-[2rem] shadow-2xl grayscale-[15%]" src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop" />
      <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-black/55 backdrop-blur-xl border border-white/10 p-5"><p className="text-2xl font-serif">Nueva colección esencial</p><p className="text-white/60 text-sm">Diseño minimalista · Talles S al XL · Compra por WhatsApp</p></div>
    </motion.div>
  </section>
}

function About() {
  return <section className="h-full px-6 md:px-12 grid lg:grid-cols-2 gap-8 items-center">
    <img loading="lazy" className="h-[62vh] w-full object-cover rounded-[2rem]" src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop" />
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      <motion.p variants={fade} className="text-xs tracking-[0.4em] uppercase text-[var(--accent)]">Nosotros</motion.p>
      <motion.h2 variants={fade} className="font-serif text-5xl md:text-7xl">Confección industrial con mirada cercana.</motion.h2>
      <motion.p variants={fade} className="text-white/65">IF Confecciones nace como una marca paraguaya enfocada en prendas cómodas, versátiles y bien terminadas. Desde Itauguá, combinamos experiencia textil, control de calidad y atención personalizada.</motion.p>
      <div className="grid sm:grid-cols-3 gap-3 pt-4"><Stat n="S-XL" t="Talles" /><Stat n="100%" t="WhatsApp" /><Stat n="Central" t="Delivery" /></div>
    </motion.div>
  </section>
}

function Stat({ n, t }: { n: string; t: string }) { return <Card className="bg-white/5 border-white/10 rounded-3xl"><CardContent className="p-5"><p className="text-3xl font-serif text-white">{n}</p><p className="text-white/50 text-sm">{t}</p></CardContent></Card> }

function Products({ products, setSelected, addCart }: { products: Product[]; setSelected: SetSelected; addCart: (product: Product, size: string) => void }) {
  return <section className="h-full px-6 md:px-12 overflow-y-auto pb-12"><Title label="Catálogo Inteligente" title="Prendas por línea" />
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">{products.map((p) => <ProductCard key={p.id} p={p} setSelected={setSelected} addCart={addCart} />)}</div>
  </section>
}

function Shop({ products, query, setQuery, setSelected, addCart }: { products: Product[]; query: string; setQuery: Dispatch<SetStateAction<string>>; setSelected: SetSelected; addCart: (product: Product, size: string) => void }) {
  return <section className="h-full px-6 md:px-12 overflow-y-auto pb-12"><Title label="Tienda Online" title="Próximamente" />
    <div className="mt-8 flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center max-w-lg">
        <p className="text-sm text-[var(--accent)] mb-2">Estamos trabajando</p>
        <h3 className="font-serif text-3xl mb-2">Tienda Online — Próximamente</h3>
        <p className="text-white/60">La pasarela de pago y la integración con el backend estarán disponibles pronto. Mientras tanto podés usar la sección <strong className="text-white">Catálogo</strong> para explorar productos y confirmar compras por WhatsApp.</p>
      </div>
    </div>
  </section>
}

function ProductCard({ p, setSelected, addCart }: { p: Product; setSelected: SetSelected; addCart: (product: Product, size: string) => void }) {
  const firstSize = Object.keys(p.sizes).find((s) => p.sizes[s] > 0) || "M";
  return <motion.div whileHover={{ y: -8 }} className="group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden shadow-xl">
    <div className="relative h-72 overflow-hidden"><img loading="lazy" src={getImageUrl(p.image)} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><p className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs">{p.category}</p><div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition"><div className="flex gap-2">{Object.entries(p.sizes).map(([s, stock]) => <button key={s} onClick={() => stock > 0 && addCart(p, s)} className={`px-3 py-2 rounded-xl text-xs ${stock > 0 ? "bg-white text-black" : "bg-red-500/40 text-white line-through"}`}>{s}: {stock}</button>)}</div></div></div>
    <div className="p-5 space-y-3"><h3 className="font-serif text-2xl">{p.name}</h3><p className="text-white/50 text-sm">{p.desc}</p><div className="flex items-center justify-between"><strong className="text-xl text-[var(--accent)]">{gs(p.price)}</strong><div className="flex gap-2"><Button onClick={() => setSelected(p)} variant="outline" className="rounded-full border-white/20 bg-white/5">Ver</Button><Button onClick={() => addCart(p, firstSize)} className="rounded-full bg-white text-black"><Plus size={16} /></Button></div></div></div>
  </motion.div>
}

function Contact() {
  return <section className="h-full px-6 md:px-12 grid lg:grid-cols-2 gap-8 items-center"><div className="space-y-6"><Title label="Contacto" title="Compra directa y atención personalizada" /><p className="text-white/65 max-w-xl">Realizá tu pedido desde la tienda online y confirmalo por WhatsApp. También podés consultar por talles, disponibilidad y delivery.</p><div className="space-y-3 text-white/75"><p><MapPin className="inline mr-2" />Itauguá Km 25 · Mbokajaty del Sur</p><p><MessageCircle className="inline mr-2" />0976 689727</p><p><Shirt className="inline mr-2" />Remeras, sudaderas, joggers, blusas y palazos</p></div><Button onClick={() => window.open("https://wa.me/595976689727", "_blank")} className="rounded-full bg-[#25D366] text-black hover:bg-[#25D366]/90"><MessageCircle className="mr-2" />Ir a WhatsApp</Button></div><div className="rounded-[2rem] bg-white/5 border border-white/10 p-8"><p className="font-serif text-4xl mb-4">IF Confecciones</p><p className="text-white/60">Calidad que se diseña, comodidad que se viste.</p></div></section>
}

function Title({ label, title }: { label: string; title: string }) { return <div className="pt-6"><p className="text-xs tracking-[0.4em] uppercase text-[var(--accent)] mb-3">{label}</p><h2 className="font-serif text-4xl md:text-6xl">{title}</h2></div> }
function MagneticButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={onClick} className="rounded-full px-7 py-3 bg-[var(--accent)] text-black font-semibold shadow-xl">{children}</motion.button> }

function SideMenu({ open, setOpen, setSection }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; setSection: SetSection }) { return <AnimatePresence>{open && <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 bg-[#0f0f10] p-8"><Button onClick={() => setOpen(false)} className="float-right"><X /></Button><div className="mt-20 space-y-4">{sections.map((s, i) => <button key={s} onClick={() => { setSection(i); setOpen(false); }} className="block font-serif text-4xl">{s}</button>)}</div></motion.div>}</AnimatePresence> }

function Cart({ open, setOpen, cart, setCart, removeItem, subtotal, total, zone, setZone, client, setClient, address, setAddress, waOrder }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; cart: CartItem[]; setCart: (cart: CartItem[]) => void; removeItem: (key: string) => void; subtotal: number; total: number; zone: Zone; setZone: Dispatch<SetStateAction<Zone>>; client: string; setClient: Dispatch<SetStateAction<string>>; address: string; setAddress: Dispatch<SetStateAction<string>>; waOrder: () => void }) {
  return <AnimatePresence>{open && <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[430px] bg-[#111] border-l border-white/10 p-6 overflow-y-auto"><div className="flex justify-between items-center"><h3 className="font-serif text-3xl">Carrito</h3><Button onClick={() => setOpen(false)} variant="ghost"><X /></Button></div><div className="mt-6 space-y-3">{cart.length === 0 && <p className="text-white/50">Tu carrito está vacío.</p>}{cart.map((i) => <div key={i.key} className="bg-white/5 rounded-2xl p-4 flex justify-between gap-3"><div><p className="font-semibold">{i.name}</p><p className="text-sm text-white/50">Talle {i.size} · {gs(i.price)} · x{i.qty}</p></div><div className="flex gap-1"><Button size="sm" onClick={() => setCart(cart.map((x) => x.key === i.key ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}><Minus size={14} /></Button><Button size="sm" onClick={() => setCart(cart.map((x) => x.key === i.key ? { ...x, qty: x.qty + 1 } : x))}><Plus size={14} /></Button><Button size="sm" onClick={() => removeItem(i.key)}><Trash2 size={14} /></Button></div></div>)}</div><div className="mt-6 space-y-3"><input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Nombre del cliente" className="w-full bg-white/10 rounded-xl p-3 outline-none" /><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección o link de ubicación" className="w-full bg-white/10 rounded-xl p-3 outline-none" /><select value={zone.city} onChange={(e) => setZone(zones.find((z) => z.city === e.target.value) ?? zones[0])} className="w-full bg-white/10 rounded-xl p-3 outline-none">{zones.map((z) => <option className="bg-black" key={z.city}>{z.city}</option>)}</select></div><div className="mt-6 border-t border-white/10 pt-4 space-y-2"><p className="flex justify-between"><span>Subtotal</span><strong>{gs(subtotal)}</strong></p><p className="flex justify-between"><span>Envío</span><strong>{gs(zone.delivery)}</strong></p><p className="flex justify-between text-xl"><span>Total</span><strong className="text-[var(--accent)]">{gs(total)}</strong></p></div><Button disabled={!cart.length} onClick={waOrder} className="w-full mt-6 rounded-full bg-[#25D366] text-black hover:bg-[#25D366]/90"><MessageCircle className="mr-2" /> Confirmar por WhatsApp</Button></motion.aside>}</AnimatePresence>
}

function ProductModal({ selected, setSelected, addCart, products }: { selected: Product | null; setSelected: SetSelected; addCart: (product: Product, size: string) => void; products: Product[] }) {
  const suggestions = selected ? products.filter((p) => p.id !== selected.id).slice(0, 2) : [];
  return <AnimatePresence>{selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl p-5 md:p-10 overflow-y-auto"><Button onClick={() => setSelected(null)} className="fixed top-5 right-5 rounded-full"><X /></Button><div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto pt-12"><img src={getImageUrl(selected.image)} className="w-full h-[70vh] object-cover rounded-[2rem]" /><div className="space-y-5"><p className="text-[var(--accent)] tracking-[0.3em] uppercase text-xs">Product Deep-Dive</p><h2 className="font-serif text-5xl">{selected.name}</h2><p className="text-white/60">{selected.desc}</p><p className="text-white/70"><strong>Composición:</strong> {selected.composition}</p><p className="text-3xl text-[var(--accent)] font-bold">{gs(selected.price)}</p><div className="flex flex-wrap gap-2">{Object.entries(selected.sizes).map(([s, stock]) => <Button key={s} disabled={stock <= 0} onClick={() => addCart(selected, s)} className="rounded-full bg-white text-black">Talle {s} · {stock > 0 ? `${stock} disp.` : "Sold out"}</Button>)}</div><div className="bg-white/5 border border-white/10 rounded-3xl p-5"><h3 className="font-serif text-2xl mb-2">Completa el look</h3><div className="grid grid-cols-2 gap-3">{suggestions.map((p) => <button key={p.id} onClick={() => setSelected(p)} className="text-left"><img src={getImageUrl(p.image)} className="h-32 w-full object-cover rounded-2xl mb-2" /><p className="text-sm">{p.name}</p></button>)}</div></div></div></div></motion.div>}</AnimatePresence>
}

function Admin({ open, setOpen, auth, setAuth, login, setLogin, products, setProducts, top, margin, accent, setAccent, banner, setBanner, exportCSV }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; auth: boolean; setAuth: Dispatch<SetStateAction<boolean>>; login: { user: string; pass: string }; setLogin: Dispatch<SetStateAction<{ user: string; pass: string }>>; products: Product[]; setProducts: (products: Product[]) => void; top: Product[]; margin: number; accent: string; setAccent: (accent: string) => void; banner: string; setBanner: (banner: string) => void; exportCSV: () => void }) {
  const tryLogin = () => { if (login.user === "admin" && login.pass === "admin") setAuth(true); };
  return <AnimatePresence>{open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl p-5 md:p-10 overflow-y-auto"><Button onClick={() => setOpen(false)} className="fixed top-5 right-5 rounded-full"><X /></Button>{!auth ? <div className="max-w-md mx-auto mt-24 bg-white/5 border border-white/10 rounded-[2rem] p-8"><Lock className="mb-4 text-[var(--accent)]" /><h2 className="font-serif text-4xl mb-5">Admin Panel</h2><input placeholder="Usuario" value={login.user} onChange={(e) => setLogin({ ...login, user: e.target.value })} className="w-full bg-white/10 rounded-xl p-3 mb-3" /><input placeholder="Contraseña" type="password" value={login.pass} onChange={(e) => setLogin({ ...login, pass: e.target.value })} className="w-full bg-white/10 rounded-xl p-3 mb-4" /><Button onClick={tryLogin} className="w-full rounded-full bg-[var(--accent)] text-black">Entrar</Button><p className="text-xs text-white/40 mt-3">Credenciales: admin / admin</p></div> : <div className="max-w-7xl mx-auto space-y-8"><Title label="God Mode" title="Master Admin Panel" /><div className="grid md:grid-cols-4 gap-4"><AdminCard icon={<Package />} n={products.length} t="Productos" /><AdminCard icon={<BarChart3 />} n={gs(margin)} t="Margen bruto estimado" /><AdminCard icon={<ShoppingBag />} n={top[0]?.name} t="Más clickeado" /><AdminCard icon={<Settings />} n="Activo" t="Theme editor" /></div><div className="grid lg:grid-cols-2 gap-5"><div className="bg-white/5 border border-white/10 rounded-[2rem] p-5"><h3 className="font-serif text-3xl mb-4">Inventario editable</h3>{products.map((p) => <div key={p.id} className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 bg-black/20 p-3 rounded-2xl"><input value={p.name} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, name: e.target.value } : x))} className="bg-white/10 rounded-xl p-2" /><input value={p.price} type="number" onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, price: Number(e.target.value) } : x))} className="bg-white/10 rounded-xl p-2" /><input value={typeof p.image === 'string' ? p.image : ''} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, image: e.target.value } : x))} className="bg-white/10 rounded-xl p-2" placeholder="URL de imagen" /><input value={p.sizes.M} type="number" onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, sizes: { ...x.sizes, M: Number(e.target.value) } } : x))} className="bg-white/10 rounded-xl p-2" /></div>)}</div><div className="space-y-5"><div className="bg-white/5 border border-white/10 rounded-[2rem] p-5"><h3 className="font-serif text-3xl mb-4">Business Intelligence</h3>{top.map((p) => <div key={p.id} className="mb-3"><div className="flex justify-between text-sm"><span>{p.name}</span><span>{p.clicks} clicks</span></div><div className="h-2 bg-white/10 rounded-full"><div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(100, p.clicks / 2)}%` }} /></div></div>)}<Button onClick={exportCSV} className="mt-4 rounded-full bg-white text-black"><Download className="mr-2" />Exportar Excel CSV</Button><Button onClick={() => window.print()} variant="outline" className="mt-4 ml-2 rounded-full border-white/20 bg-white/5"><FileText className="mr-2" />Catálogo PDF</Button></div><div className="bg-white/5 border border-white/10 rounded-[2rem] p-5"><h3 className="font-serif text-3xl mb-4">Diseño dinámico y marketing</h3><label className="text-sm text-white/60">Color de acento</label><input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="block mt-2 mb-4 w-24 h-12 bg-transparent" /><label className="text-sm text-white/60">Banner promocional</label><textarea value={banner} onChange={(e) => setBanner(e.target.value)} className="w-full mt-2 bg-white/10 rounded-xl p-3" /></div></div></div></div>}</motion.div>}</AnimatePresence>
}

function AdminCard({ icon, n, t }: { icon: React.ReactNode; n: React.ReactNode; t: string }) { return <Card className="bg-white/5 border-white/10 rounded-3xl"><CardContent className="p-5"> <div className="text-[var(--accent)] mb-3">{icon}</div><p className="font-serif text-2xl truncate text-white">{n}</p><p className="text-white/50 text-sm">{t}</p></CardContent></Card> }

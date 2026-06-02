import { useState, createContext, useContext, useEffect, useRef, useCallback } from "react";
import "./App.css";

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const PRODUCTS = [
  { id:1,  name:"Gold Necklace",       price:120, originalPrice:160, image:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&auto=format&fit=crop",  category:"necklace", rating:4.8, reviews:124, badge:"Bestseller", stock:8  },
  { id:2,  name:"Diamond Ring",        price:250, originalPrice:320, image:"https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=600&auto=format&fit=crop",  category:"ring",     rating:4.9, reviews:89,  badge:"New",        stock:0  },
  { id:3,  name:"Pearl Earrings",      price:90,  originalPrice:90,  image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&auto=format&fit=crop",  category:"earrings", rating:4.7, reviews:203, badge:"Classic",    stock:15 },
  { id:4,  name:"Gold Bracelet",       price:90,  originalPrice:120, image:"https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=600&auto=format&fit=crop",  category:"bracelet", rating:4.6, reviews:67,  badge:"Sale",       stock:3  },
  { id:5,  name:"Heart Necklace",      price:200, originalPrice:200, image:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop",  category:"necklace", rating:4.9, reviews:312, badge:"Popular",    stock:0  },
  { id:6,  name:"Rose Gold Ring",      price:180, originalPrice:220, image:"https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&auto=format&fit=crop",  category:"ring",     rating:4.9, reviews:140, badge:"Popular",    stock:6  },
  { id:7,  name:"Luxury Diamond Set",  price:850, originalPrice:999, image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&auto=format&fit=crop",  category:"earrings", rating:5.0, reviews:210, badge:"Luxury",     stock:2  },
  { id:8,  name:"Clove Bracelet",      price:100, originalPrice:130, image:"https://images.unsplash.com/photo-1573408301185-9519f94815b8?w=600&auto=format&fit=crop",  category:"bracelet", rating:4.5, reviews:44,  badge:"Sale",       stock:11 },
  { id:9,  name:"Titanium Steel Cuff", price:600, originalPrice:600, image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&auto=format&fit=crop",  category:"bracelet", rating:4.8, reviews:28,  badge:"Luxury",     stock:0  },
  { id:10, name:"Royal Gold Bracelet", price:320, originalPrice:400, image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop",  category:"bracelet", rating:4.8, reviews:120, badge:"Sale",       stock:4  },
];

const EMOJI      = { necklace:"📿", ring:"💍", earrings:"✨", bracelet:"⌚" };
const CATEGORIES = ["all","necklace","ring","earrings","bracelet"];

const TESTIMONIALS = [
  { name:"Sofia R.",  avatar:"S", text:"Absolutely stunning quality. The gold necklace exceeded every expectation — packaging was exquisite.", stars:5 },
  { name:"Amara K.",  avatar:"A", text:"Fast shipping, beautiful packaging. The diamond ring is breathtaking in person — worth every penny.", stars:5 },
  { name:"Layla M.",  avatar:"L", text:"I've ordered three times now. Every piece is crafted with incredible attention to detail. Truly luxury.", stars:5 },
];

/* ══════════════════════════════════════
   CONTEXT
══════════════════════════════════════ */
const AppContext = createContext();
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const [cart,     setCart]     = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toasts,   setToasts]   = useState([]);

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      return found
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });
    addToast(`${product.name} added to cart ✓`);
  };

  const changeQty = (id, delta) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));

  const removeFromCart = id => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart      = () => setCart([]);

  const toggleWishlist = (product) => {
    const exists = wishlist.find(i => i.id === product.id);
    setWishlist(prev => exists ? prev.filter(i => i.id !== product.id) : [...prev, product]);
    addToast(exists ? "Removed from wishlist" : "Saved to wishlist ♥", exists ? "info" : "success");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{ cart, wishlist, cartCount, cartTotal, toasts, addToCart, changeQty, removeFromCart, clearCart, toggleWishlist }}>
      {children}
    </AppContext.Provider>
  );
}

/* ══════════════════════════════════════
   TOASTS
══════════════════════════════════════ */
function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>)}
    </div>
  );
}

/* ══════════════════════════════════════
   PARTICLES
══════════════════════════════════════ */
function Particles() {
  const pts = useRef(Array.from({ length: 18 }, (_, i) => ({
    key: i, left: `${(i * 19 + 3) % 100}%`,
    delay: `${(i * 0.6) % 8}s`, 
    duration: `${7 + (i % 5)}s`,
    size: `${2 + (i % 3)}px`,
     opacity: 0.15 + (i % 5) * 0.09,
  })),[]).current;
  return (
    <div className="particles" aria-hidden="true">
      {pts.map(p => (
        <div key={p.key} className="particle" style={{ left:p.left, animationDelay:p.delay, animationDuration:p.duration, width:p.size, height:p.size, opacity:p.opacity }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   PRODUCT IMAGE
══════════════════════════════════════ */
function ProductImage({ src, category, className, alt }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken)
    return <div className={`${className} img-placeholder`}>{EMOJI[category] || "💎"}</div>;
  return <img className={className} src={src} alt={alt || ""} onError={() => setBroken(true)} />;
}

/* ══════════════════════════════════════
   STARS
══════════════════════════════════════ */
function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => <span key={s} className={s <= Math.round(rating) ? "star filled" : "star"}>★</span>)}
      <span className="rating-num">{rating}</span>
    </div>
  );
}

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
function Navbar({ onCartOpen, onWishlistOpen, step, setStep }) {
  const { cartCount, wishlist } = useApp();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-brand" onClick={() => setStep("home")}>
        <span className="brand-diamond">◆</span> Sparkling Ember
      </div>
      <div className="nav-links">
        {[["home","Home"],["shop","Collection"],["about","About"],["contact","Contact"]].map(([s,l]) => (
          <button key={s} className={`nav-link${step===s?" active":""}`} onClick={() => setStep(s)}>{l}</button>
        ))}
      </div>
      <div className="nav-actions">
        <button className="icon-btn" onClick={onWishlistOpen} title="Wishlist">
          ♥{wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </button>
        <button className="icon-btn" onClick={onCartOpen} title="Cart">
          🛍{cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
function Hero({ onShop }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <Particles />
      <div className="hero-content">
        <p className="hero-eyebrow">✦ New Collection 2026 ✦</p>
        <h1 className="hero-title">
          Crafted for the<br /><em>Extraordinary</em>
        </h1>
        <p className="hero-sub">
          Handcrafted fine jewellery for those who demand perfection.
          Each piece is a story of timeless elegance and master craftsmanship.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={onShop}>
            Explore Collection <span>→</span>
          </button>
          <button className="btn-ghost" onClick={onShop}>
            <span>▶</span> Our Story
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat"><strong>2,400+</strong><span>Happy Clients</span></div>
          <div className="stat"><strong>18k</strong><span>Gold Certified</span></div>
          <div className="stat"><strong>Free</strong><span>Global Shipping</span></div>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        scroll
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   3D PRODUCT CARD
══════════════════════════════════════ */
function ProductCard({ product, onQuickView, index }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const [added, setAdded] = useState(false);
  const [tilt,  setTilt]  = useState({ x:0, y:0 });
  const cardRef   = useRef(null);
  const wished    = wishlist.some(i => i.id === product.id);
  const soldOut   = product.stock === 0;
  const lowStock  = product.stock > 0 && product.stock <= 3;
  const discount  = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const onMove = e => {
    if (soldOut) return;
    const r = cardRef.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top)  / r.height - 0.5) * 16,
      y: ((e.clientX - r.left) / r.width  - 0.5) * -16,
    });
  };
// Sold out option//
  const handleAdd = () => {
    if (soldOut) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      ref={cardRef}
      className={`card${soldOut ? " card-sold-out" : ""}`}
      style={{ transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, animationDelay:`${index * 0.07}s` }}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x:0, y:0 })}
    >
      {/* Sold Out ribbon */}
      {soldOut && <div className="sold-out-ribbon">Sold Out</div>}

      {/* Badge — hide if sold out */}
      {!soldOut && product.badge && <div className={`card-badge badge-${product.badge.toLowerCase()}`}>{product.badge}</div>}
      {!soldOut && discount > 0   && <div className="card-discount">-{discount}%</div>}

      <div className="card-img-wrap">
        <ProductImage src={product.image} category={product.category} className="card-img" alt={product.name} />

        {/* Sold-out overlay on image */}
        {soldOut && <div className="sold-out-overlay"><span>Sold Out</span></div>}

        {/* Quick view only when in stock */}
        {!soldOut && (
          <div className="card-img-overlay">
            <button className="overlay-btn" onClick={() => onQuickView(product)}>Quick View</button>
          </div>
        )}
        <button className={`wish-btn${wished ? " wished" : ""}`} onClick={() => toggleWishlist(product)}>
          {wished ? "♥" : "♡"}
        </button>
      </div>

      <div className="card-body">
        <div className="card-category">{product.category}</div>
        <div className="card-name">{product.name}</div>
        <Stars rating={product.rating} />
        <div className="card-reviews">({product.reviews} reviews)</div>

        {/* Stock indicator */}
        {soldOut  && <div className="stock-tag stock-out">✕ Out of Stock</div>}
        {lowStock && <div className="stock-tag stock-low">⚡ Only {product.stock} left</div>}

        <div className="card-pricing">
          {soldOut
            ? <span className="card-price sold-out-price">${product.price}</span>
            : <span className="card-price">${product.price}</span>
          }
          {!soldOut && discount > 0 && <span className="card-original">${product.originalPrice}</span>}
        </div>

        {soldOut ? (
          <button className="btn-add btn-sold-out" disabled>Sold Out</button>
        ) : (
          <button className={`btn-add${added ? " btn-added" : ""}`} onClick={handleAdd}>
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   QUICK VIEW MODAL
══════════════════════════════════════ */
function Modal({ product, onClose }) {
  const { addToCart } = useApp();
  const [added, setAdded] = useState(false);
  const [qty,   setQty]   = useState(1);
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true); setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-img-wrap">
          <ProductImage src={product.image} category={product.category} className="modal-img" alt={product.name} />
          {discount > 0 && <div className="modal-discount-tag">-{discount}% OFF</div>}
        </div>
        <div className="modal-body">
          <div className="modal-category">{product.category}</div>
          <h2 className="modal-name">{product.name}</h2>
          <Stars rating={product.rating} />
          <p className="modal-review-count">{product.reviews} verified reviews</p>
          <div className="modal-pricing">
            <span className="modal-price">${product.price}</span>
            {discount > 0 && <span className="modal-original">${product.originalPrice}</span>}
          </div>
          <p className="modal-desc">A hand-selected masterpiece from our curated collection. Crafted with 18k gold and premium gemstones for those who demand the very finest.</p>
          <div className="modal-features">
            <span className="feature-tag">✦ 18k Gold</span>
            <span className="feature-tag">✦ Handcrafted</span>
            <span className="feature-tag">✦ Certified</span>
            <span className="feature-tag">✦ Gift Boxed</span>
          </div>
          <div className="modal-qty-row">
            <span className="qty-label">Quantity</span>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
              <span className="qty-num">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
            </div>
          </div>
          <button className={`btn-modal-add${added?" btn-added":""}`} onClick={handleAdd}>
            {added ? "✓ Added to Cart" : `Add to Cart — $${product.price * qty}`}
          </button>
          <p className="modal-shipping">🚚 Free worldwide shipping · 30-day returns</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   WISHLIST PANEL
══════════════════════════════════════ */
function WishlistPanel({ open, onClose }) {
  const { wishlist, addToCart, toggleWishlist } = useApp();
  return (
    <>
      <div className={`overlay${open?" show":""}`} onClick={onClose} />
      <div className={`side-panel${open?" open":""}`}>
        <div className="panel-header">
          <div className="panel-title">Wishlist ♥</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="panel-items">
          {wishlist.length === 0 ? (
            <div className="panel-empty"><div className="panel-empty-icon">♡</div><div>Your wishlist is empty</div></div>
          ) : wishlist.map(item => (
            <div className="panel-item" key={item.id}>
              <ProductImage src={item.image} category={item.category} className="panel-item-img" alt={item.name} />
              <div className="panel-item-info">
                <div className="panel-item-name">{item.name}</div>
                <div className="panel-item-price">${item.price}</div>
              </div>
              <div className="panel-item-actions">
                <button className="btn-small-gold" onClick={() => addToCart(item)}>Add to Cart</button>
                <button className="btn-small-remove" onClick={() => toggleWishlist(item)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   CART PANEL
══════════════════════════════════════ */
function CartPanel({ open, onClose, onCheckout }) {
  const { cart, cartTotal, changeQty, removeFromCart } = useApp();
  return (
    <>
      <div className={`overlay${open?" show":""}`} onClick={onClose} />
      <div className={`side-panel${open?" open":""}`}>
        <div className="panel-header">
          <div className="panel-title">Shopping Cart 🛍</div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="panel-items">
          {cart.length === 0 ? (
            <div className="panel-empty"><div className="panel-empty-icon">🛒</div><div>Your cart is empty</div></div>
          ) : cart.map(item => (
            <div className="panel-item" key={item.id}>
              <ProductImage src={item.image} category={item.category} className="panel-item-img" alt={item.name} />
              <div className="panel-item-info">
                <div className="panel-item-name">{item.name}</div>
                <div className="panel-item-price">${item.price} × {item.qty} = <strong>${item.price * item.qty}</strong></div>
              </div>
              <div className="panel-item-actions">
                <div className="qty-ctrl small">
                  <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => changeQty(item.id,  1)}>+</button>
                </div>
                <button className="btn-small-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="panel-footer">
            <div className="panel-subtotal"><span>Subtotal</span><span>${cartTotal}</span></div>
            <div className="panel-subtotal"><span>Shipping</span><span className="free-tag">FREE</span></div>
            <div className="panel-total"><span>Total</span><span>${cartTotal}</span></div>
            <button className="btn-checkout-panel" onClick={onCheckout}>Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════ */
function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-header">
        <p className="section-eyebrow">✦ Client Stories</p>
        <h2 className="section-title">Loved by <em>Thousands</em></h2>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <div className="testimonial-stars">{"★".repeat(t.stars)}</div>
            <p className="testimonial-text">"{t.text}"</p>
            <div className="testimonial-name">— {t.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════
   HOME
══════════════════════════════════════ */
function Home({ onShop }) {
  return (
    <>
      <Hero onShop={onShop} />
      <section className="features-strip">
        {[
          { icon:"🚚", title:"Free Shipping",   sub:"Worldwide delivery"  },
          { icon:"💎", title:"18k Gold",         sub:"Certified quality"   },
          { icon:"🔄", title:"30-Day Returns",   sub:"Hassle-free policy"  },
          { icon:"🔒", title:"Secure Payment",   sub:"256-bit encryption"  },
        ].map((f,i) => (
          <div className="feature" key={i}>
            <span className="feature-icon">{f.icon}</span>
            <div><strong>{f.title}</strong><span>{f.sub}</span></div>
          </div>
        ))}
      </section>
      <section className="featured-section">
        <div className="section-header">
          <p className="section-eyebrow">✦ Handpicked For You</p>
          <h2 className="section-title">Featured <em>Pieces</em></h2>
          <p className="section-desc">Discover our most-loved designs, each one a testament to master craftsmanship.</p>
        </div>
        <div className="grid">
          {PRODUCTS.slice(0,3).map((p,i) => <ProductCard key={p.id} product={p} onQuickView={() => {}} index={i} />)}
        </div>
        <div className="checkout-bar">
          <button className="btn-cta-gold" onClick={onShop}>View Full Collection →</button>
        </div>
      </section>
      <Testimonials />
    </>
  );
}

/* ══════════════════════════════════════
   SHOP
══════════════════════════════════════ */
function Shop({ onCheckout }) {
  const [filter, setFilter] = useState("all");
  const [sort,   setSort]   = useState("default");
  const [modal,  setModal]  = useState(null);
  const [search, setSearch] = useState("");

  let filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "price-asc")  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === "rating")     filtered = [...filtered].sort((a,b) => b.rating - a.rating);

  return (
    <div className="shop-page">
      <div className="shop-hero-banner">
        <div className="shop-hero-bg" />
        <div className="shop-hero-overlay" />
        <div className="shop-hero-text">
          <p className="section-eyebrow">✦ Our Collection</p>
          <h1>Fine <em style={{fontStyle:"italic",color:"#e8c97a"}}>Jewellery</em></h1>
          <p>Discover pieces crafted for the extraordinary</p>
        </div>
      </div>

      <div className="section-header" style={{ paddingBottom: "20px" }}>
        <div className="shop-controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search pieces..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filters">
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-btn${filter===c?" active":""}`} onClick={() => setFilter(c)}>
                {c.charAt(0).toUpperCase()+c.slice(1)}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {filtered.length === 0
          ? <div className="no-results">No pieces found for "{search}"</div>
          : filtered.map((p,i) => <ProductCard key={p.id} product={p} onQuickView={setModal} index={i} />)
        }
      </div>
      <div className="checkout-bar">
        <button className="btn-cta-gold" onClick={onCheckout}>Proceed to Checkout →</button>
      </div>
      {modal && <Modal product={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

/* ══════════════════════════════════════
   ABOUT
══════════════════════════════════════ */
function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-bg" />
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <p className="section-eyebrow">✦ Our Story</p>
          <h1>Crafted with <em style={{fontStyle:"italic",color:"#e8c97a"}}>Passion</em></h1>
          <p>A legacy of fine jewellery spanning three decades</p>
        </div>
      </div>
      <div className="about-body">
        <div className="about-grid">
          <div>
            <img className="about-img" src="https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=800&auto=format&fit=crop" alt="Atelier" />
          </div>
          <div className="about-text">
            <h2>Three Decades of Excellence</h2>
            <p>Founded in 1994, Sparkling Ember began as a small atelier with a singular obsession: creating jewellery that transcends time. Our master craftsmen work with the finest 18k gold and ethically sourced gemstones to produce pieces that become heirlooms.</p>
            <p>Every necklace, ring, and bracelet is meticulously hand-finished — inspected under magnification before it ever reaches your hands. We believe jewellery isn't just an accessory; it's a memory you wear.</p>
            <p>Today, we serve clients in over 50 countries, maintaining the same uncompromising standards our founders instilled. When you choose Sparkling Ember, you choose a piece that will outlast trends and outlive generations.</p>
          </div>
        </div>
        <div className="about-values">
          {[
            { icon:"💎", title:"Master Craftsmanship", desc:"Every piece is hand-finished by artisans with decades of experience in luxury jewellery." },
            { icon:"🌿", title:"Ethical Sourcing",     desc:"We source only conflict-free gemstones and recycled precious metals for all our collections." },
            { icon:"🎁", title:"Luxury Experience",    desc:"From our signature packaging to complimentary gift wrapping, every detail is considered." },
          ].map((v,i) => (
            <div className="value-card" key={i}>
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CONTACT
══════════════════════════════════════ */
function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (Object.values(form).some(v => !v.trim())) { alert("Please fill in all fields."); return; }
    setSent(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-hero-bg" />
        <div className="contact-hero-overlay" />
        <div className="contact-hero-content">
          <p className="section-eyebrow">✦ Get In Touch</p>
          <h1>Contact <em style={{fontStyle:"italic",color:"#e8c97a"}}>Us</em></h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>
      <div className="contact-body">
        <div className="contact-info">
          <h3>Let's Connect</h3>
          {[
            { icon:"📍", title:"Visit Us",       text:"123 Jewellery Lane\nNew York, NY 10001" },
            { icon:"📞", title:"Call Us",        text:"+1 (800) 555-0199\nMon–Fri, 9am–6pm EST" },
            { icon:"✉️", title:"Email Us",       text:"hello@sparklingembers.com\nWe reply within 24 hours" },
            { icon:"⏰", title:"Working Hours",  text:"Monday – Friday: 9am – 6pm\nSaturday: 10am – 4pm" },
          ].map((c,i) => (
            <div className="contact-item" key={i}>
              <span className="contact-item-icon">{c.icon}</span>
              <div className="contact-item-text">
                <strong>{c.title}</strong>
                <span style={{whiteSpace:"pre-line"}}>{c.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="contact-form-wrap">
          {sent ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontSize:"3rem", marginBottom:"16px" }}>✦</div>
              <h3 style={{ fontFamily:"Playfair Display, serif", fontSize:"1.5rem", color:"var(--white)", marginBottom:"12px" }}>Message Sent!</h3>
              <p style={{ color:"var(--muted)", fontSize:"0.9rem", lineHeight:1.8 }}>Thank you for reaching out. We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div className="contact-form-title">Send a Message</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input className="form-input" value={form.name} onChange={set("name")} placeholder="Jane Smith" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={form.subject} onChange={set("subject")} placeholder="Enquiry about a piece..." />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" value={form.message} onChange={set("message")} placeholder="Tell us how we can help you..." />
              </div>
              <button className="btn-cta-gold btn-full" onClick={handleSubmit}>Send Message →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   CHECKOUT
══════════════════════════════════════ */
const EMPTY_FORM = { name:"", email:"", address:"", city:"", zip:"", card:"", expiry:"", cvv:"" };

function Checkout({ onBack, onSuccess }) {
  const { cart, cartTotal, clearCart } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1);
  const tax   = Math.round(cartTotal * 0.08);
  const grand = cartTotal + tax;
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const nextStep = () => {
    if (["name","email","address","city","zip"].some(k => !form[k].trim())) { alert("Please fill in all shipping fields."); return; }
    setStep(2);
  };
  const placeOrder = () => {
    if (["card","expiry","cvv"].some(k => !form[k].trim())) { alert("Please fill in payment details."); return; }
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    clearCart(); setForm(EMPTY_FORM); onSuccess();
  };

  return (
    <div className="checkout-wrap">
      <button className="btn-back" onClick={onBack}>← Back to Shop</button>
      <div className="checkout-steps">
        <div className={`checkout-step${step>=1?" active":""}`}><span className="step-num">1</span>Shipping</div>
        <div className="step-connector" />
        <div className={`checkout-step${step>=2?" active":""}`}><span className="step-num">2</span>Payment</div>
      </div>
      <div className="checkout-grid">
        <div className="checkout-form">
          <h2 className="checkout-heading">{step===1 ? "Shipping Details" : "Payment Details"}</h2>
          {step === 1 && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={set("name")} placeholder="Jane Smith" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Shipping Address</label>
                <input className="form-input" value={form.address} onChange={set("address")} placeholder="123 Main Street" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={form.city} onChange={set("city")} placeholder="New York" />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input className="form-input" value={form.zip} onChange={set("zip")} placeholder="10001" />
                </div>
              </div>
              <button className="btn-cta-gold btn-full" style={{marginTop:"8px"}} onClick={nextStep}>Continue to Payment →</button>
            </>
          )}
          {step === 2 && (
            <>
              <div className="card-visual">
                <div className="card-vis-chip" />
                <div className="card-vis-num">{form.card || "•••• •••• •••• ••••"}</div>
                <div className="card-vis-row">
                  <span>{form.name.toUpperCase() || "YOUR NAME"}</span>
                  <span>{form.expiry || "MM/YY"}</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <input className="form-input" value={form.card} onChange={set("card")} placeholder="•••• •••• •••• ••••" maxLength={19} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Expiry</label>
                  <input className="form-input" value={form.expiry} onChange={set("expiry")} placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-input" value={form.cvv} onChange={set("cvv")} placeholder="•••" maxLength={3} />
                </div>
              </div>
              <div className="form-row" style={{marginTop:"8px"}}>
                <button className="btn-back-step" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-cta-gold" onClick={placeOrder} style={{flex:2}}>Place Order — ${grand}</button>
              </div>
            </>
          )}
        </div>
        <div>
          <div className="order-summary">
            <div className="summary-title">Order Summary</div>
            {cart.length === 0
              ? <p className="empty-summary">No items in cart.</p>
              : cart.map(item => (
                <div className="summary-item" key={item.id}>
                  <ProductImage src={item.image} category={item.category} className="summary-item-img" alt={item.name} />
                  <div className="summary-item-info">
                    <div className="summary-item-name">{item.name}</div>
                    <div className="summary-item-qty">Qty: {item.qty}</div>
                  </div>
                  <div className="summary-item-price">${item.price * item.qty}</div>
                </div>
              ))
            }
            <hr className="summary-divider" />
            <div className="summary-line"><span>Subtotal</span><span>${cartTotal}</span></div>
            <div className="summary-line"><span>Shipping</span><span className="free-tag">FREE</span></div>
            <div className="summary-line"><span>Tax (8%)</span><span>${tax}</span></div>
            <div className="summary-total"><span>Total</span><span>${grand}</span></div>
          </div>
          <div className="secure-badge">🔒 Secured by 256-bit SSL Encryption</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SUCCESS
══════════════════════════════════════ */
function Success({ onReset }) {
  return (
    <div className="success-wrap">
      <div className="success-icon">✦</div>
      <h1 className="success-title">Order Confirmed</h1>
      <div className="success-line" />
      <p className="success-sub">
        Thank you for choosing Sparkling Ember.<br />
        Your jewellery will be carefully packaged and dispatched within 1–2 business days.<br />
        A confirmation email is on its way.
      </p>
      <button className="btn-cta-gold" onClick={onReset}>Continue Shopping</button>
    </div>
  );
}

/* ══════════════════════════════════════
   FOOTER
══════════════════════════════════════ */
function Footer({ setStep }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div className="footer-logo">◆ Sparkling <span>Ember</span></div>
          <p>Fine jewellery crafted for those who demand the extraordinary. Timeless pieces, exceptional quality.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <a onClick={() => setStep("shop")}>All Collections</a>
          <a onClick={() => setStep("shop")}>Necklaces</a>
          <a onClick={() => setStep("shop")}>Rings</a>
          <a onClick={() => setStep("shop")}>Bracelets</a>
          <a onClick={() => setStep("shop")}>Earrings</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a onClick={() => setStep("about")}>Our Story</a>
          <a onClick={() => setStep("about")}>Craftsmanship</a>
          <a onClick={() => setStep("about")}>Sustainability</a>
          <a onClick={() => setStep("contact")}>Contact</a>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a>Shipping Policy</a>
          <a>Returns & Exchanges</a>
          <a>Ring Size Guide</a>
          <a>Care Instructions</a>
          <a>FAQ</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 Sparkling Ember Fine Jewellery — All rights reserved</span>
        <span className="footer-gold">◆ Crafted with passion</span>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   ROOT APP
══════════════════════════════════════ */
export default function App() {
  const [step,         setStep]         = useState("home");
  const [cartOpen,     setCartOpen]     = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  useEffect(() => { window.scrollTo(0,0); }, [step]);

  const goCheckout = () => { setCartOpen(false); setStep("checkout"); };

  return (
    <AppProvider>
      <Navbar
        onCartOpen={() => setCartOpen(true)}
        onWishlistOpen={() => setWishlistOpen(true)}
        step={step}
        setStep={setStep}
      />
      {step === "home"     && <Home     onShop={() => setStep("shop")} />}
      {step === "shop"     && <Shop     onCheckout={goCheckout} />}
      {step === "about"    && <About />}
      {step === "contact"  && <Contact />}
      {step === "checkout" && <Checkout onBack={() => setStep("shop")} onSuccess={() => setStep("success")} />}
      {step === "success"  && <Success  onReset={() => setStep("home")} />}
      <CartPanel     open={cartOpen}     onClose={() => setCartOpen(false)}     onCheckout={goCheckout} />
      <WishlistPanel open={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      {!["checkout","success"].includes(step) && <Footer setStep={setStep} />}
      <Toasts />
    </AppProvider>
  );
}

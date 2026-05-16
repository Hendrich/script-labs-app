import React, { useMemo, useState } from "react";
import { products } from "../../data/products.js";
import "./shop.css";
import { useAuth } from "../../hooks/AuthContext.jsx";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const readInitialCart = () => {
  try {
    return JSON.parse(localStorage.getItem("scriptLabsCart")) || [];
  } catch (_) {
    return [];
  }
};

const iconPaths = {
  lock: (
    <>
      <rect x="7" y="10" width="10" height="8" rx="2" />
      <path d="M9 10V8a3 3 0 0 1 6 0v2" />
    </>
  ),
  cart: (
    <>
      <path d="M6 6h15l-2 8H8L6 3H3" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 17 8 4 8-4" />
    </>
  ),
  api: (
    <>
      <path d="M8 9 4 12l4 3" />
      <path d="m16 9 4 3-4 3" />
      <path d="m14 5-4 14" />
    </>
  ),
  document: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </>
  ),
  checklist: (
    <>
      <path d="M8 7h10" />
      <path d="M8 12h10" />
      <path d="M8 17h10" />
      <path d="m4 7 .8.8L6.5 6" />
      <path d="m4 12 .8.8 1.7-1.8" />
      <path d="m4 17 .8.8 1.7-1.8" />
    </>
  ),
};

function ProductIcon({ type }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="product-svg-icon">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {iconPaths[type] || iconPaths.layers}
      </g>
    </svg>
  );
}

function Shop() {
  const { user } = useAuth();
  const isProblemUser = user?.status === "problem";
  const [checkoutError, setCheckoutError] = useState("");
  const [cart, setCart] = useState(readInitialCart);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    email: "",
    company: "",
    notes: "",
  });
  const [orderComplete, setOrderComplete] = useState(false);

  const categories = useMemo(
    () => ["All", ...new Set(products.map((product) => product.category))],
    [],
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      `${product.name} ${product.description} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const checkoutReady = cart.length > 0;
  const detailsReady = Boolean(checkoutData.fullName && checkoutData.email);

  const saveCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem("scriptLabsCart", JSON.stringify(nextCart));
  };

  const addToCart = (product) => {
    setOrderComplete(false);
    const existingItem = cart.find((item) => item.id === product.id);
    const nextCart = existingItem
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cart, { ...product, quantity: 1 }];
    saveCart(nextCart);
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Math.max(1, quantity);
    const nextCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: nextQuantity } : item,
    );
    saveCart(nextCart);
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    saveCart([]);
    setOrderComplete(false);
  };

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutData((current) => ({ ...current, [name]: value }));
  };

  const handleCheckout = (event) => {
    event.preventDefault();
    setCheckoutError("");

    if (!cart.length) return;

    if (isProblemUser) {
      setOrderComplete(false);
      setCheckoutError(
        "Checkout failed for problem_user. This is an intentional demo bug for automation testing.",
      );
      return;
    }

    setOrderComplete(true);
    saveCart([]);
  };

  return (
    <section className="shop-section" data-testid="shop-section">
      <div className="shop-hero ecommerce-hero">
        <div>
          <p className="shop-eyebrow">QA Commerce Playground</p>
          <h2>Shop automation assets and test a realistic checkout journey.</h2>
          <p>
            Product browsing, cart behavior, checkout validation, and success
            state are designed to be clear, repeatable, and automation-friendly.
          </p>
        </div>
        <div className="shop-hero-metrics">
          <div>
            <strong>{products.length}</strong>
            <span>Products</span>
          </div>
          <div>
            <strong>{cartCount}</strong>
            <span>Cart Items</span>
          </div>
          <div>
            <strong>{formatRupiah(cartTotal)}</strong>
            <span>Total</span>
          </div>
        </div>
      </div>

      <div className="shop-toolbar">
        <input
          type="search"
          placeholder="Search product or test type..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          data-testid="product-search"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          data-testid="category-filter"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="shop-layout">
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article
              className="product-card ecommerce-product-card"
              key={product.id}
            >
              <div className="product-image" aria-hidden="true">
                <div className="product-mockup-card">
                  <ProductIcon type={product.iconType} />
                  <span className="mockup-line wide" />
                  <span className="mockup-line" />
                </div>
              </div>
              <div className="product-body">
                <div className="product-meta">
                  <span>{product.category}</span>
                  <strong>{product.badge}</strong>
                </div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <ul>
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="product-footer">
                <span className="product-price">
                  {formatRupiah(product.price)}
                </span>
                <button
                  className="btn primary"
                  onClick={() => addToCart(product)}
                  data-testid={`add-${product.id}`}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-panel" data-testid="cart-panel">
          <div className="checkout-stepper" aria-label="Checkout progress">
            <div className={`step ${cart.length ? "active" : ""}`}>
              <span>1</span>
              Cart
            </div>
            <div className={`step ${detailsReady ? "active" : ""}`}>
              <span>2</span>
              Details
            </div>
            <div className={`step ${orderComplete ? "active" : ""}`}>
              <span>3</span>
              Success
            </div>
          </div>

          <div className="cart-header">
            <h3>Order Summary</h3>
            {cart.length > 0 && (
              <button className="link-button" onClick={clearCart}>
                Clear
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span className="empty-cart-icon">Cart</span>
              <p>
                Your cart is empty. Add a product to start checkout testing.
              </p>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatRupiah(item.price)}</span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                    >
                      −
                    </button>
                    <span data-testid={`qty-${item.id}`}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Increase ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="cart-total">
            <span>Total</span>
            <strong data-testid="cart-total">{formatRupiah(cartTotal)}</strong>
          </div>

          <form className="checkout-form" onSubmit={handleCheckout}>
            <h4>Checkout Details</h4>
            <label>
              Full Name
              <input
                name="fullName"
                value={checkoutData.fullName}
                onChange={handleCheckoutChange}
                placeholder="Hendri Christianto"
                required
                data-testid="checkout-name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={checkoutData.email}
                onChange={handleCheckoutChange}
                placeholder="qa@example.com"
                required
                data-testid="checkout-email"
              />
            </label>
            <label>
              Company / Portfolio Note
              <input
                name="company"
                value={checkoutData.company}
                onChange={handleCheckoutChange}
                placeholder="Optional"
              />
            </label>
            <label>
              Notes
              <textarea
                name="notes"
                value={checkoutData.notes}
                onChange={handleCheckoutChange}
                placeholder="Add testing notes or scenario details..."
              />
            </label>
            <button
              className="btn primary checkout-button"
              type="submit"
              disabled={!checkoutReady}
              data-testid="checkout-submit"
            >
              Complete Checkout
            </button>
            {isProblemUser && (
              <div
                className="problem-user-banner"
                data-testid="problem-user-banner"
              >
                Problem user mode: checkout is intentionally blocked for
                negative testing.
              </div>
            )}
          </form>

          {checkoutError && (
            <div className="checkout-error" data-testid="checkout-error">
              {checkoutError}
            </div>
          )}

          {orderComplete && (
            <div className="checkout-success" data-testid="checkout-success">
              Checkout successful. This demo order is ready for automation
              validation.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default Shop;

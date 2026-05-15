import React, { useMemo, useState } from "react";
import { products } from "../../data/products.js";
import "./shop.css";

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

function Shop() {
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
    []
  );

  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

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
            : item
        )
      : [...cart, { ...product, quantity: 1 }];
    saveCart(nextCart);
  };

  const updateQuantity = (productId, quantity) => {
    const nextQuantity = Math.max(1, quantity);
    const nextCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: nextQuantity } : item
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
    if (!cart.length) return;
    setOrderComplete(true);
    saveCart([]);
  };

  return (
    <section className="shop-section" data-testid="shop-section">
      <div className="shop-hero">
        <div>
          <p className="shop-eyebrow">QA Commerce Playground</p>
          <h2>Practice automation on a realistic checkout flow</h2>
          <p>
            Product catalog, cart, quantity changes, checkout validation, and
            success state are ready for Cypress, Selenium, and Playwright demos.
          </p>
        </div>
        <div className="shop-cart-pill" data-testid="cart-count">
          🛒 {cartCount} item{cartCount === 1 ? "" : "s"}
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
            <article className="product-card" key={product.id}>
              <div className="product-icon" aria-hidden="true">
                {product.icon}
              </div>
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
              <div className="product-footer">
                <span className="product-price">{formatRupiah(product.price)}</span>
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
          <div className="cart-header">
            <h3>Checkout Cart</h3>
            {cart.length > 0 && (
              <button className="link-button" onClick={clearCart}>
                Clear
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span>🧺</span>
              <p>Your cart is empty. Add a product to start checkout testing.</p>
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
              disabled={!cart.length}
              data-testid="checkout-submit"
            >
              Complete Checkout
            </button>
          </form>

          {orderComplete && (
            <div className="checkout-success" data-testid="checkout-success">
              ✅ Checkout successful. This is a demo order for automation testing.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default Shop;

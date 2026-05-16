import React from "react";
import "./testingGuide.css";

const scenarios = [
  {
    title: "Authentication",
    items: [
      "Register user baru",
      "Login dengan credential valid",
      "Login dengan password salah",
      "Verify token tersimpan dan digunakan di request private",
    ],
  },
  {
    title: "Product Shop",
    items: [
      "Search product berdasarkan keyword",
      "Filter product berdasarkan category",
      "Add product to cart",
      "Increase dan decrease quantity",
      "Remove product dari cart",
    ],
  },
  {
    title: "Checkout",
    items: [
      "Submit checkout tanpa cart",
      "Validasi required field checkout",
      "Complete checkout dan validasi success message",
      "Pastikan cart kosong setelah checkout berhasil",
    ],
  },
  {
    title: "Script CRUD",
    items: [
      "Create script lab",
      "Edit title dan description",
      "Delete script lab",
      "Pastikan data hanya tampil untuk user login",
    ],
  },
];

function TestingGuide() {
  return (
    <section className="testing-guide">
      <div className="testing-guide-hero">
        <p className="guide-eyebrow">Testing Guide</p>
        <h2>Use Script Labs as a QA automation portfolio playground.</h2>
        <p>
          Halaman ini merangkum skenario yang bisa dipakai untuk manual testing,
          API testing, Cypress, Selenium, dan Playwright.
        </p>
      </div>

      <div className="guide-grid">
        {scenarios.map((scenario) => (
          <article className="guide-card" key={scenario.title}>
            <h3>{scenario.title}</h3>
            <ul>
              {scenario.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="demo-users-guide-card">
        <h3>Demo Users for Testing</h3>
        <div className="demo-users-guide-list">
          <div>
            <strong>Standard User</strong>
            <code>standard_user@example.com</code>
            <code>script_sauce</code>
            <span>Expected: login success, checkout success.</span>
          </div>

          <div>
            <strong>Admin</strong>
            <code>admin@example.com</code>
            <code>admin123</code>
            <span>Expected: login success with admin role.</span>
          </div>

          <div>
            <strong>Locked User</strong>
            <code>locked_user@example.com</code>
            <code>script_sauce</code>
            <span>Expected: login failed with USER_LOCKED.</span>
          </div>

          <div>
            <strong>Problem User</strong>
            <code>problem_user@example.com</code>
            <code>script_sauce</code>
            <span>Expected: login success, checkout failed intentionally.</span>
          </div>
        </div>
      </div>

      <div className="selector-card">
        <h3>Recommended Automation Selectors</h3>
        <p>
          Product Shop sudah menyediakan beberapa selector stabil untuk
          automation.
        </p>
        <pre>{`[data-testid="product-search"]
[data-testid="category-filter"]
[data-testid="cart-panel"]
[data-testid="cart-count"]
[data-testid="cart-total"]
[data-testid="checkout-name"]
[data-testid="checkout-email"]
[data-testid="checkout-submit"]
[data-testid="checkout-success"]`}</pre>
      </div>
    </section>
  );
}

export default TestingGuide;

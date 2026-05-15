import React from "react";
import AuthContainer from "../auth/AuthContainer.jsx";
import "./landing.css";

function LandingPage() {
  return (
    <section className="landing-page">
      <div className="landing-hero">
        <div className="landing-copy">
          <p className="landing-eyebrow">QA Automation Playground</p>
          <h2>Practice real testing flows in one portfolio-ready demo app.</h2>
          <p>
            Script Labs combines login, product catalog, cart, checkout, and CRUD
            scenarios so QA engineers can practice manual testing, API testing,
            and UI automation with realistic user journeys.
          </p>
          <div className="landing-actions">
            <a className="btn primary" href="#auth-panel">
              Start Testing
            </a>
            <a className="btn secondary" href="#testing-scenarios">
              View Scenarios
            </a>
          </div>
        </div>

        <div className="landing-preview" aria-label="Script Labs preview card">
          <div className="preview-window">
            <div className="preview-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-card large">
              <span>🛒</span>
              <div>
                <strong>Checkout Flow</strong>
                <p>Cart, quantity, form validation, success state</p>
              </div>
            </div>
            <div className="preview-grid">
              <div className="preview-card">
                <span>🔐</span>
                <strong>Auth</strong>
              </div>
              <div className="preview-card">
                <span>🧪</span>
                <strong>CRUD</strong>
              </div>
              <div className="preview-card">
                <span>🎭</span>
                <strong>E2E</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="testing-scenarios" className="landing-scenarios">
        <article>
          <span>01</span>
          <h3>Manual Testing</h3>
          <p>Design test cases for login, product filtering, cart behavior, and checkout validation.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Automation Testing</h3>
          <p>Use stable UI states and test IDs for Cypress, Selenium, or Playwright scripts.</p>
        </article>
        <article>
          <span>03</span>
          <h3>API + Database Flow</h3>
          <p>Validate authenticated CRUD operations connected to the backend API and PostgreSQL.</p>
        </article>
      </div>

      <div className="landing-auth-layout">
        <div className="landing-info-panel">
          <p className="landing-eyebrow">What you can test</p>
          <ul>
            <li>Valid and invalid login scenarios</li>
            <li>Product search and category filter</li>
            <li>Add to cart, remove item, and quantity changes</li>
            <li>Checkout form required-field validation</li>
            <li>Create, edit, and delete script records</li>
          </ul>
        </div>
        <div id="auth-panel" className="landing-auth-card">
          <h3>Login or Register</h3>
          <p>Access the testing dashboard and start executing the demo flows.</p>
          <AuthContainer />
        </div>
      </div>
    </section>
  );
}

export default LandingPage;

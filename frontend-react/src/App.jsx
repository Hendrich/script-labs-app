import React, { useEffect } from "react";
import "./App.css";
import "./styles/common.css";
import "./styles/auth.css";
import "./styles/books.css";
import { useAuth } from "./hooks/AuthContext.jsx";
import AuthContainer from "./components/auth/AuthContainer.jsx";
import Dashboard from "./Dashboard.jsx";

function App() {
	const { user, logout } = useAuth();

	// Monitor user state changes
	useEffect(() => {
		console.log('🔄 App: User state changed to:', user);
	}, [user]);

	console.log('🚀 App render - Current user:', user);
	console.log('🔐 Is authenticated:', !!user);
	console.log('🗂️ localStorage token:', localStorage.getItem('token'));
	console.log('👤 localStorage user:', localStorage.getItem('user'));

	return (
		<div className="app-wrapper">
			<header>
				<div className="container">
					<h1>📚 Book Catalog</h1>
					{user && (
						<nav>
							<span id="welcome-user">Hello, {user.email}</span>
							<button className="btn secondary" onClick={logout}>
								Logout
							</button>
						</nav>
					)}
				</div>
			</header>
			<main style={{ minHeight: "60vh", marginBottom: "2rem" }}>
				{!user ? (
					<AuthContainer />
				) : (
					<Dashboard />
				)}
			</main>
		</div>
	);
}

export default App;

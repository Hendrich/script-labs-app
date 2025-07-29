import React, { useState } from 'react';
import { useAuth } from '../../hooks/AuthContext.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [formErrors, setFormErrors] = useState({});
	const { login, loading, error, user } = useAuth();

	console.log('🔑 Login component - Current user:', user);

	const validateForm = () => {
		const errors = {};

		if (!email) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Please enter a valid email address';
		}

		if (!password) {
			errors.password = 'Password is required';
		} else if (password.length < 6) {
			errors.password = 'Password must be at least 6 characters';
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		try {
			console.log('📝 Form submitted, attempting login...');
			const response = await login(email, password);
			console.log('🎉 Login response received:', response);
			// Clear form on successful login
			setEmail('');
			setPassword('');
			setFormErrors({});
		} catch (err) {
			console.error('🚫 Login error in component:', err);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="auth-form" noValidate>
			<h2 className="form-title">Welcome Back</h2>
			<p className="form-subtitle">Sign in to access your book catalog</p>

			{error && <ErrorMessage message={error} />}

			<div className="form-group">
				<label htmlFor="email" className="form-label">
					Email Address
				</label>
				<input
					id="email"
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className={`form-input ${formErrors.email ? 'error' : ''}`}
					autoComplete="email"
					aria-describedby={formErrors.email ? 'email-error' : undefined}
					required
				/>
				{formErrors.email && (
					<span id="email-error" className="field-error">
						{formErrors.email}
					</span>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="password" className="form-label">
					Password
				</label>
				<input
					id="password"
					type="password"
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className={`form-input ${formErrors.password ? 'error' : ''}`}
					autoComplete="current-password"
					aria-describedby={formErrors.password ? 'password-error' : undefined}
					required
				/>
				{formErrors.password && (
					<span id="password-error" className="field-error">
						{formErrors.password}
					</span>
				)}
			</div>

			<button
				type="submit"
				className="btn primary auth-submit-btn"
				disabled={loading}
			>
				{loading ? (
					<>
						<LoadingSpinner size="small" inline={true} />
						<span>Signing in...</span>
					</>
				) : (
					<>
						<span>Sign In</span>
						<span className="btn-arrow">→</span>
					</>
				)}
			</button>
		</form>
	);
};

export default Login;

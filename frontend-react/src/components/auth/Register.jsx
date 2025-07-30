import React, { useState } from 'react';
import { useAuth } from '../../hooks/AuthContext.jsx';
import ErrorMessage from '../common/ErrorMessage.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const Register = ({ onSuccess }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [formErrors, setFormErrors] = useState({});
	const [success, setSuccess] = useState('');
	const { register, loading, error } = useAuth();

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

		if (!confirmPassword) {
			errors.confirmPassword = 'Please confirm your password';
		} else if (password !== confirmPassword) {
			errors.confirmPassword = 'Passwords do not match';
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
			await register({ email, password });
			setSuccess('Account created successfully! You can now sign in.');
			setEmail('');
			setPassword('');
			setConfirmPassword('');
			setFormErrors({});

			// Auto switch to login after 2 seconds
			setTimeout(() => {
				if (onSuccess) onSuccess();
			}, 2000);
		} catch (err) {
			// Error handled by useAuth hook
		}
	};

	return (
		<form onSubmit={handleSubmit} className="auth-form" noValidate>
			<h2 className="form-title">Create Account</h2>
			<p className="form-subtitle">Join us to start building your book collection</p>

			{error && <ErrorMessage message={error} />}
			{success && (
				<div className="success-message">
					<span className="success-icon">✓</span>
					{success}
				</div>
			)}

			<div className="form-group">
				<label htmlFor="register-email" className="form-label">
					Email Address
				</label>
				<input
					id="register-email"
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className={`form-input ${formErrors.email ? 'error' : ''}`}
					autoComplete="email"
					aria-describedby={formErrors.email ? 'register-email-error' : undefined}
					required
				/>
				{formErrors.email && (
					<span id="register-email-error" className="field-error">
						{formErrors.email}
					</span>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="register-password" className="form-label">
					Password
				</label>
				<input
					id="register-password"
					type="password"
					placeholder="Create a password (min. 6 characters)"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className={`form-input ${formErrors.password ? 'error' : ''}`}
					autoComplete="new-password"
					aria-describedby={formErrors.password ? 'register-password-error' : undefined}
					required
				/>
				{formErrors.password && (
					<span id="register-password-error" className="field-error">
						{formErrors.password}
					</span>
				)}
			</div>

			<div className="form-group">
				<label htmlFor="confirm-password" className="form-label">
					Confirm Password
				</label>
				<input
					id="confirm-password"
					type="password"
					placeholder="Confirm your password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
					autoComplete="new-password"
					aria-describedby={formErrors.confirmPassword ? 'confirm-password-error' : undefined}
					required
				/>
				{formErrors.confirmPassword && (
					<span id="confirm-password-error" className="field-error">
						{formErrors.confirmPassword}
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
						<span>Creating account...</span>
					</>
				) : (
					<>
						<span>Create Account</span>
						<span className="btn-arrow">→</span>
					</>
				)}
			</button>
		</form>
	);
};

export default Register;

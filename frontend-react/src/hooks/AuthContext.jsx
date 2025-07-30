import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		console.log('🚀 AuthProvider: Initializing auth state...');
		const currentUser = authService.getCurrentUser();
		console.log('👤 AuthProvider: Current user from localStorage:', currentUser);
		setUser(currentUser);
		setLoading(false);
	}, []);

	const login = async (email, password) => {
		try {
			setLoading(true);
			setError(null);
			console.log('🔄 AuthProvider: Attempting login for:', email);
			const response = await authService.login(email, password);
			console.log('✅ AuthProvider: Login response:', response);

			if (response.user) {
				console.log('👤 AuthProvider: Setting user state:', response.user);
				setUser(response.user);
				console.log('🔄 AuthProvider: User state updated, should trigger re-render');
			} else {
				console.error('❌ AuthProvider: No user in response');
				throw new Error('Login failed: No user data received');
			}

			return response;
		} catch (err) {
			console.error('❌ AuthProvider: Login failed:', err.message);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const register = async (userData) => {
		try {
			setLoading(true);
			setError(null);
			const response = await authService.register(userData);
			// Don't automatically set user state on registration
			// User should login after successful registration
			return response;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		console.log('🚪 AuthProvider: Logging out...');
		authService.logout();
		setUser(null);
		console.log('👤 AuthProvider: User state cleared');
	};

	const value = {
		user,
		loading,
		error,
		login,
		register,
		logout,
		isAuthenticated: !!user
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

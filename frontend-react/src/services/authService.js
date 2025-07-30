import { apiService } from './api.js';
import { API_CONFIG } from '../constants/config.js';

export const authService = {
	async login(email, password) {
		console.log('🌐 AuthService: Making login API call...');
		const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
			email,
			password,
		});

		console.log('📦 AuthService: Raw API response:', response);

		// Handle API response structure (assuming response.data contains user and token)
		const userData = response.data?.user || response.user;
		const token = response.data?.token || response.token;

		console.log('👤 AuthService: Extracted user:', userData);
		console.log('🔑 AuthService: Extracted token:', token);

		if (token && userData) {
			localStorage.setItem('token', token);
			localStorage.setItem('user', JSON.stringify(userData));
			console.log('💾 AuthService: Stored user and token in localStorage');
		} else {
			console.warn('⚠️ AuthService: Missing user or token in response');
		}

		return {
			user: userData,
			token: token,
			success: response.success
		};
	},

	async register(userData) {
		const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);

		// Handle API response structure
		const user = response.data?.user || response.user;
		const token = response.data?.token || response.token;

		// Don't automatically save to localStorage on registration
		// User needs to login after successful registration

		return {
			user: user,
			token: token,
			success: response.success
		};
	},

	logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	},

	getCurrentUser() {
		const user = localStorage.getItem('user');
		return user ? JSON.parse(user) : null;
	},

	getToken() {
		return localStorage.getItem('token');
	},

	isAuthenticated() {
		return !!this.getToken();
	}
};

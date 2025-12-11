import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Add token to requests
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Auth endpoints
export const auth = {
	register: (data) => api.post('/auth/register', data),
	login: (data) => api.post('/auth/login', data),
	getMe: () => api.get('/auth/me'),
	updateProfile: (data) => api.put('/auth/profile', data)
};

// Article endpoints
export const articles = {
	getAll: (params) => api.get('/articles', { params }),
	getOne: (slug) => api.get(`/articles/${slug}`),
	getTrending: () => api.get('/articles/trending'),
	create: (data) => api.post('/articles', data),
	update: (id, data) => api.put(`/articles/${id}`, data),
	delete: (id) => api.delete(`/articles/${id}`),
	getDrafts: () => api.get('/articles/user/drafts')
};

// Comment endpoints
export const comments = {
	getAll: (articleId) => api.get(`/articles/${articleId}/comments`),
	create: (articleId, data) => api.post(`/articles/${articleId}/comments`, data),
	update: (id, data) => api.put(`/comments/${id}`, data),
	delete: (id) => api.delete(`/comments/${id}`)
};

// User endpoints
export const users = {
	getProfile: (username) => api.get(`/users/${username}`)
};

export default api;
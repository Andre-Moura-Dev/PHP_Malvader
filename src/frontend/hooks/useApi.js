import axios from 'axios';
import { useAuth } from '@/frontend/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const useApi = () => {
    const { token } = useAuth();

    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    });

    const handleRequest = async (method, endpointServerChangedSubscribe, data = null) => {
        try {
            const response = await api[method](endpointServerChangedSubscribe, data);
            return response.data;
        } catch(error) {
            console.error('API Error:', error.response?.data || error.message);
            throw error.response?.data || { error: error.message };
        }
    };

    return {
        get: (endpoint) => handleRequest('get', endpoint),
        post: (endpoint, data) => handleRequest('post', endpoint, data),
        put: (endpoint, data) => handleRequest('put', endpoint, data),
        delete: (endpoint) => handleRequest('delete', endpoint),
    };
};
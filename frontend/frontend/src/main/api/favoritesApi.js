import axios from 'axios'
import api from './authInterceptorApi.js'

const BASE_URL = 'http://localhost:8080/api/obserwowane'

export const addToFavorites = (userId, mieszkanieId) => {
    return api.post(`${BASE_URL}/add`, { userId, mieszkanieId });
};

export const removeFromFavorites = (userId, mieszkanieId) => {
    return api.remove(`${BASE_URL}/remove`, { userId, mieszkanieId });
};

export const getFavorites = (userId) => {
    return api.get(`${BASE_URL}/${userId}`);
};
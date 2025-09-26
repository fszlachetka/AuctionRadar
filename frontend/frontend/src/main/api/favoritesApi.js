import api from './authInterceptorApi.js'

const BASE_URL = 'http://localhost:8080/api/obserwowane'

export const addToFavorites = (userId, mieszkanieId) => {
    console.log("Adding to favorites:", { userId, mieszkanieId });
    return api.post(`${BASE_URL}/add`, { userId, mieszkanieId });
};

export const removeFromFavorites = async (userId, mieszkanieId) => {
    return api.delete(`${BASE_URL}/remove`, {
        data: {
            userId: userId,
            mieszkanieId: mieszkanieId
        }
    });
};
export const getFavorites = (userId) => {
    return api.get(`${BASE_URL}/${userId}`);
};
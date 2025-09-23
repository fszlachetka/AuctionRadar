import axios from 'axios'
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../services/authService.js'

const api = axios.create({
    baseURL: 'http://localhost:8080',
})

api.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
        console.log("token sent")
    }
    return config
})
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const refreshToken = getRefreshToken()
            if (refreshToken) {
                try {
                    const res = await axios.post('http://localhost:8080/api/refresh', { refreshToken })
                    const { accessToken } = res.data
                    saveTokens({ accessToken, refreshToken })
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
                    return api(originalRequest)
                } catch (refreshError) {
                    clearTokens()
                    window.location.href = '/login'
                }
            }
        }
        return Promise.reject(error)
    }
)

export default api

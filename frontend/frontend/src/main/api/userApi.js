import api from './authInterceptorApi.js'

const BASE_URL = 'http://localhost:8080/api'

export const createUser = (user)=>
    api.post(`${BASE_URL}/user/create`, user)

export const getUserByLogin = (login)=>
    api.get(`${BASE_URL}/user/${login}`)

export const loginUser = (login, password)=>
    api.post(`${BASE_URL}/user/login`,{
        login: login,
        passwd: password
    });

export const changePassword = (login, oldPassword, newPassword) =>
    api.post(`${BASE_URL}/user/change-password`, {
        login: login,
        oldPassword: oldPassword,
        newPassword: newPassword
    });

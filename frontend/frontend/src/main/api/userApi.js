import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

export const createUser = (user)=>
    axios.post(`${BASE_URL}/user/create`, user)

export const getUserByLogin = (login)=>
    axios.get(`${BASE_URL}/user/${login}`)

export const loginUser = (login, password)=>
    axios.post(`${BASE_URL}/user/login`,{
        login: login,
        passwd: password
    });

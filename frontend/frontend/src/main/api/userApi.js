import axios from 'axios'

const BASE_URL = 'http://localhost:8081/backend/rest'

export const createUser = (user) => axios.post(`${BASE_URL}/user`, user)

export const getUserByLogin = (login) => axios.get(`${BASE_URL}/user/${login}`)

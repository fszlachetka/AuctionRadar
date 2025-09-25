import api from './authInterceptorApi.js'
import { mockApartments } from '../../test/mocks/apartments'

const BASE_URL = 'http://localhost:8080/api/mieszkania'

const USE_MOCKS = false

export const getAllApartments = () => {
    if (USE_MOCKS === true) {
        console.log('Using mock apartments data')
        return Promise.resolve({ data: mockApartments })
    }
    return api.get(BASE_URL)
}

export const getApartmentById = (id) => {
    if (USE_MOCKS === true) {
        console.log('Using mock apartments dataaa')
        const apartment = mockApartments.find((apt) => apt.mieszkanieId === id)
        return Promise.resolve({ data: apartment })
    }
   return api.get(`${BASE_URL}/${id}`)
}

export const filterApartments = (filters) => {
    return api.post(`${BASE_URL}/filter`, filters);
};

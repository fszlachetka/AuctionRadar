import axios from 'axios'
import { mockApartments } from '../../test/mocks/apartments'

const BASE_URL = 'http://localhost:8080/api/mieszkania'

export const getAllApartments = () => {
    //if (process.env.REACT_APP_USE_MOCKS === 'true') {
        //return Promise.resolve({ data: mockApartments })
    //}
    return axios.get(BASE_URL)
}

export const getApartmentById = (id) => {
    //if (process.env.REACT_APP_USE_MOCKS === 'true') {
        //const apartment = mockApartments.find((apt) => apt.mieszkanieId === id)
        //return Promise.resolve({ data: apartment })
    //}
   return axios.get(`${BASE_URL}/${id}`)
}

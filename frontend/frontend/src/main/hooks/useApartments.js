import { useState, useEffect } from 'react'
import { getAllApartments, getApartmentById } from '../api/apartmentApi'

export function useApartments() {
    const [apartments, setApartments] = useState([])
    const [selectedApartment, setSelectedApartment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadApartments()
    }, [])

    const loadApartments = async () => {
        try {
            const response = await getAllApartments()
            setApartments(response.data)
            setLoading(false)
        } catch (err) {
            setError('Failed to load apartments')
            setLoading(false)
        }
    }

    const selectApartment = async (id) => {
        try {
            const response = await getApartmentById(id)
            setSelectedApartment(response.data)
        } catch (err) {
            setError('Failed to load apartment details')
        }
    }

    return {
        apartments,
        selectedApartment,
        loading,
        error,
        selectApartment
    }
}
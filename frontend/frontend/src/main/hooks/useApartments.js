import { useState } from 'react'
export function useApartments() {
    const [apartments, setApartments] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const loadApartments = async (filters = null) => {
        setLoading(true)
        try {
            const response = filters ?
                await filterApartments(filters) :
                await getAllApartments()
            setApartments(response.data)
            setError(null)
        } catch (err) {
            setError('Failed to load apartments')
        } finally {
            setLoading(false)
        }
    }

    return {
        apartments,
        loading,
        error,
        setApartments,
        loadApartments
    }
}
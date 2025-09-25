import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getApartmentById } from '../api/apartmentApi'
import ApartmentDetails from '../components/ApartmentDetails'

export default function ApartmentDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [apartment, setApartment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadApartment()
    }, [id])

    const loadApartment = async () => {
        try {
            const response = await getApartmentById(parseInt(id))
            if (!response.data) {
                throw new Error('Nie znaleziono nieruchomości')
            }
            setApartment(response.data)
            setError(null)
        } catch (err) {
            setError('Nie udało się załadować szczegółów nieruchomości')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        navigate('/apartments')
    }

    if (loading) {
        return <div style={containerStyle}>Loading...</div>
    }

    if (error) {
        return <div style={containerStyle}>Error: {error}</div>
    }

    if (!apartment) {
        return <div style={containerStyle}>Apartment not found</div>
    }

    return (
        <div style={containerStyle}>
            <ApartmentDetails
                apartment={apartment}
                onClose={handleClose}
            />
        </div>
    )
}

const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
}
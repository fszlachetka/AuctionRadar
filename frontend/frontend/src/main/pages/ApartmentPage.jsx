import { useApartments } from '../hooks/useApartments'
import ApartmentList from '../components/ApartmentList'
import ApartmentDetails from '../components/ApartmentDetails'

export default function ApartmentPage() {
    const { apartments, selectedApartment, loading, error, selectApartment } = useApartments()

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <main style={mainStyle}>
            <h1>Available Apartments</h1>
            <ApartmentList
                apartments={apartments}
                onSelect={selectApartment}
            />
            {selectedApartment && (
                <ApartmentDetails
                    apartment={selectedApartment}
                    onClose={() => selectApartment(null)}
                />
            )}
        </main>
    )
}

const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
}
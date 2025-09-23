import { useState, useEffect, useRef } from 'react'
import { useApartments } from '../hooks/useApartments'
import ApartmentList from '../components/ApartmentList'
import ApartmentDetails from '../components/ApartmentDetails'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function ApartmentPage() {
    const { apartments, selectedApartment, loading, error, selectApartment } = useApartments()
    const [showMap, setShowMap] = useState(false)
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null) // store the map
    const markersRef = useRef([]) // store markers

    useEffect(() => {
        if (showMap && mapContainerRef.current) {
            // usun mape jesli istnieje
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }

            // zainicjalizuj mape
            mapRef.current = new maplibregl.Map({
                container: mapContainerRef.current,
                style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                center: [21.0122, 52.2297], // Longitude, Latitude (Warsaw)
                zoom: 10,
            });

            // dodaj markery
            markersRef.current = apartments
                .filter((apt) => apt.latitude && apt.longitude)
                .map((apt) => {
                    const marker = new maplibregl.Marker()
                        .setLngLat([apt.longitude, apt.latitude])
                        .setPopup(
                            new maplibregl.Popup({ offset: 25 })
                                .setHTML(
                                    `<h3>${apt.miasto}, ${apt.ulica} ${apt.numer}/${apt.numerMieszkania}</h3>
                                     <p>Price: ${apt.cena.toLocaleString()} PLN</p>
                                     <p>Size: ${apt.rozmiar} m²</p>
                                     <p>Rooms: ${apt.pokoje}</p>`
                                )
                        )
                        .addTo(mapRef.current);
                    return marker;
                });
        }
    }, [showMap, apartments]);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <main style={mainStyle}>
            <h1>Dostępne nieruchomości</h1>
            <button onClick={() => setShowMap(!showMap)} style={toggleButtonStyle}>
                {showMap ? 'Pokaż listę' : 'Pokaż mapę'}
            </button>
            {showMap ? (
                <div ref={mapContainerRef} style={{ width: '100%', height: '400px', marginTop: '2rem' }} />
            ) : (
                <ApartmentList
                    apartments={apartments}
                    onSelect={selectApartment}
                />
            )}
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

const toggleButtonStyle = {
    margin: '1rem 0',
    padding: '0.5rem 1rem',
    backgroundColor: '#646cff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
}
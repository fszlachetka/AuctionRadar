import { useState, useEffect, useRef } from 'react'
import { useApartments } from '../hooks/useApartments'
import ApartmentList from '../components/ApartmentList'
import ApartmentFilter from '../components/ApartmentFilter'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { filterApartments } from '../api/apartmentApi'
import { getFavorites, addToFavorites, removeFromFavorites } from '../api/favoritesApi.js'
import { useNavigate } from 'react-router-dom'

export default function ApartmentPage() {
    const { apartments, loading, error, setApartments } = useApartments()
    const [favorites, setFavorites] = useState([])
    const [visibleApartments, setVisibleApartments] = useState([])
    const mapContainerRef = useRef(null)
    const mapRef = useRef(null)
    const [filterByCluster, setFilterByCluster] = useState(false)
    const isMarkerClickRef = useRef(false)
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate()
    const [showMap, setShowMap] = useState(false)


    useEffect(() => {
        if (userId) loadFavorites()
    }, [userId])

    const handleApartmentSelect = (id) => {
        navigate(`/apartments/${id}`)
    }
    const loadFavorites = async () => {
        try {
            const response = await getFavorites(userId)
            setFavorites(response.data.map(f => f.mieszkanieId))
        } catch (err) {
            console.error('Failed to load favorites:', err)
        }
    }

    const handleFilter = async (filters, sortBy) => {
        try {
            const response = await filterApartments(filters)
            let sortedApartments = [...response.data]

            switch (sortBy) {
                case 'price_asc':
                    sortedApartments.sort((a, b) => a.cena - b.cena)
                    break
                case 'price_desc':
                    sortedApartments.sort((a, b) => b.cena - a.cena)
                    break
                case 'size_asc':
                    sortedApartments.sort((a, b) => a.rozmiar - b.rozmiar)
                    break
                case 'size_desc':
                    sortedApartments.sort((a, b) => b.rozmiar - a.rozmiar)
                    break
                case 'city_asc':
                    sortedApartments.sort((a, b) => a.miasto.localeCompare(b.miasto))
                    break
                case 'city_desc':
                    sortedApartments.sort((a, b) => b.miasto.localeCompare(a.miasto))
                    break
            }

            setApartments(sortedApartments)
        } catch (err) {
            console.error('Failed to filter apartments:', err)
        }
    }

    const handleToggleFavorite = async (mieszkanieId) => {
        if (!userId) {
            alert('Zaloguj się, aby obserwować nieruchomość.')
            return
        }

        let userIdToInt = parseInt(userId)

        try {
            if (favorites.includes(mieszkanieId)) {
                await removeFromFavorites(userIdToInt, mieszkanieId)
                setFavorites(favorites.filter(id => id !== mieszkanieId))
            } else {
                await addToFavorites(userIdToInt, mieszkanieId)
                setFavorites([...favorites, mieszkanieId])
            }
        } catch (err) {
            console.error('Failed to update favorites:', err)
            alert('Nie udało się dodać nieruchomości do ulubionych')
        }
    }

    const updateVisibleApartments = () => {
        if (filterByCluster) return
        if (!mapRef.current) return
        const bounds = mapRef.current.getBounds()
        const filtered = apartments.filter(
            apt =>
                apt.xcoord >= bounds.getWest() &&
                apt.xcoord <= bounds.getEast() &&
                apt.ycoord >= bounds.getSouth() &&
                apt.ycoord <= bounds.getNorth()
        )
        setVisibleApartments(filtered)
    }

    useEffect(() => {
        if (showMap) {
            updateVisibleApartments()
        } else {
            setVisibleApartments(apartments)
            setFilterByCluster(false)
        }
    }, [showMap, apartments])

    useEffect(() => {
        if (!showMap || !mapContainerRef.current) return

        if (mapRef.current) {
            mapRef.current.remove()
            mapRef.current = null
        }

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://tiles.stadiamaps.com/styles/osm_bright.json',
            center: [21.0122, 52.2297],
            zoom: 10
        })

        const points = apartments
            .filter(apt => apt.xcoord && apt.ycoord)
            .map(apt => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [apt.xcoord, apt.ycoord]
                },
                properties: {
                    id: apt.mieszkanieId,
                    title: `${apt.miasto}, ${apt.ulica} ${apt.numer}/${apt.numerMieszkania}`,
                    price: apt.cena,
                    size: apt.rozmiar,
                    rooms: apt.pokoje
                }
            }))

        mapRef.current.on('load', () => {
            mapRef.current.addSource('apartments', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: points
                },
                cluster: true,
                clusterMaxZoom: 20,
                clusterRadius: 50,
                promoteId: 'id'
            })

            mapRef.current.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'apartments',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': '#646cff',
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        5,
                        30,
                        10,
                        40
                    ]
                }
            })

            mapRef.current.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'apartments',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['Open Sans Regular'],
                    'text-size': 12
                },
                paint: { 'text-color': '#ffffff' }
            })

            mapRef.current.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'apartments',
                filter: ['!', ['has', 'point_count']],
                paint: { 'circle-color': '#646cff', 'circle-radius': 9 }
            })

            updateVisibleApartments()
        })

        mapRef.current.on('moveend', () => {
            if (isMarkerClickRef.current) {
                isMarkerClickRef.current = false
                return
            }
            setFilterByCluster(false)
            updateVisibleApartments()
        })

        mapRef.current.on('click', 'clusters', e => {
            isMarkerClickRef.current = true
            const clusterFeature = e.features[0]
            const [clLng, clLat] = clusterFeature.geometry.coordinates

            const zoom = mapRef.current.getZoom()
            const radius = 0.01 * Math.pow(2, 12 - zoom)

            const clusterApartments = apartments.filter(a =>
                Math.abs(a.xcoord - clLng) < radius && Math.abs(a.ycoord - clLat) < radius
            )

            setFilterByCluster(true)
            setVisibleApartments(clusterApartments)

            mapRef.current.easeTo({
                center: [clLng, clLat],
                zoom: Math.min(zoom + 2, 20)
            })
        })

        mapRef.current.on('click', 'unclustered-point', e => {
            isMarkerClickRef.current = true
            const id = e.features[0].properties.id
            const apt = apartments.find(a => a.mieszkanieId === id)
            if (apt) {
                setFilterByCluster(true)
                setVisibleApartments([apt]) // tylko to jedno mieszkanie
            }
        })

        mapRef.current.on('mouseenter', 'clusters', () => {
            mapRef.current.getCanvas().style.cursor = 'pointer'
        })
        mapRef.current.on('mouseleave', 'clusters', () => {
            mapRef.current.getCanvas().style.cursor = ''
        })

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [apartments, showMap])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <main style={mainStyle}>
            <h1>Dostępne nieruchomości</h1>
            <ApartmentFilter onFilter={handleFilter} />
            <button
                onClick={() => setShowMap(prev => !prev)}
                style={{
                    margin: '1rem 0',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#646cff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                {showMap ? 'Ukryj mapę' : 'Pokaż mapę'}
            </button>

            <div style={layoutStyle}>
                {showMap && (
                    <div ref={mapContainerRef} style={{ flex: 2, height: '80vh' }} />
                )}
                <div style={{ flex: showMap ? 1 : 1, overflowY: 'auto', height: '80vh' }}>
                    <ApartmentList
                        apartments={visibleApartments}
                        onSelect={handleApartmentSelect}
                        onToggleFavorite={handleToggleFavorite}
                        favorites={favorites}
                    />
                </div>
            </div>
        </main>
    )
}

const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
}

const layoutStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
}

import { useState, useEffect, useCallback } from 'react'
import { getFavorites, addToFavorites, removeFromFavorites } from '../api/favoritesApi.js'
import { getApartmentById } from '../api/apartmentApi.js'

export function useFavorites({ loadFullData = false } = {}) {
    const [favorites, setFavorites] = useState([])
    const [fullFavorites, setFullFavorites] = useState([]) // pełne mieszkania tylko jeśli trzeba

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const userId = localStorage.getItem('userId')

    const loadFavorites = useCallback(async () => {
        if (!userId) {
            setError('Użytkownik nie jest zalogowany')
            setLoading(false)
            return
        }

        try {
            const response = await getFavorites(userId)
            const ids = response.data.map(f => f.mieszkanieId)
            setFavorites(ids)

            if (loadFullData) {
                const apartmentPromises = ids.map(id => getApartmentById(id))
                const apartmentResponses = await Promise.all(apartmentPromises)
                setFullFavorites(apartmentResponses.map(r => r.data))
            }
            setLoading(false)

        } catch (err) {
            console.error('Błąd przy pobieraniu ulubionych:', err)
            setError('Nie udało się pobrać ulubionych')
            setLoading(false)
        }
    }, [userId, loadFullData])

    useEffect(() => {
        if (userId) loadFavorites()
    }, [userId, loadFavorites])

    const handleToggleFavorite = useCallback(async (mieszkanieId) => {
        if (!userId) {
            alert('Zaloguj się, aby obserwować nieruchomość.')
            return
        }

        const userIdInt = parseInt(userId)

        try {
            if (favorites.includes(mieszkanieId)) {
                await removeFromFavorites(userIdInt, mieszkanieId)
                setFavorites(prev => prev.filter(id => id !== mieszkanieId))
                if (loadFullData) {
                    setFullFavorites(prev => prev.filter(f => f.mieszkanieId !== mieszkanieId))
                }
            } else {
                await addToFavorites(userIdInt, mieszkanieId)
                setFavorites(prev => [...prev, mieszkanieId])
                if (loadFullData) {
                    const response = await getApartmentById(mieszkanieId)
                    setFullFavorites(prev => [...prev, response.data])
                }
            }
        } catch (err) {
            console.error('Błąd przy aktualizacji ulubionych:', err)
            alert('Nie udało się zmienić statusu ulubionych')
        }
    }, [favorites, userId, loadFullData])

    return {
        favorites,
        fullFavorites,
        loading,
        error,
        loadFavorites,
        handleToggleFavorite
    }

}

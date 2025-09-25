import axios from 'axios'

export const geocode = async (location) => {
    const url = `https://nominatim.openstreetmap.org/search`
    const params = {
        q: location,
        format: 'json',
        addressdetails: 1,
        limit: 1
    }

    const response = await axios.get(url, { params })
    if (response.data.length > 0) {
        const { lat, lon } = response.data[0]
        return { lat: parseFloat(lat), lng: parseFloat(lon) }
    } else {
        throw new Error('Nie znaleziono lokalizacji')
    }
}
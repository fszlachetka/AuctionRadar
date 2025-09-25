import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const [city, setCity] = useState('')
    const navigate = useNavigate()

    const handleSearch = () => {
        if (city) {
            navigate(`/apartments?city=${city}`)
        } else {
            alert('Wybierz miasto.')
        }
    }

    return (
        <main style={mainStyle}>
            <header style={headerStyle}>
                <h1>🏠 Wyszukiwarka mieszkań</h1>
            </header>

            <section style={searchSectionStyle}>
                <h2>Znajdź swoją wymarzoną nieruchomość</h2>
                <select value={city} onChange={(e) => setCity(e.target.value)} style={selectStyle}>
                    <option value="">Wybierz miasto</option>
                    <option value="Warszawa">Warszawa</option>
                    <option value="Kraków">Kraków</option>
                </select>
                <button onClick={handleSearch} style={searchButtonStyle}>Search</button>
            </section>
        </main>
    )
}

const mainStyle = {
    fontFamily: 'system-ui, sans-serif',
    padding: '2rem',
    textAlign: 'center',
}

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
}

const searchSectionStyle = {
    marginTop: '2rem',
}

const selectStyle = {
    padding: '0.5rem',
    fontSize: '1rem',
    marginRight: '1rem',
}

const searchButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
}
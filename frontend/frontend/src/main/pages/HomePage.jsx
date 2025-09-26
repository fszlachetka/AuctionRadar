import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const [city, setCity] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault();

        const filter = city.trim();

        navigate('/apartments', {
            state: {
                searchFilter: {
                    miasto: filter
                }
            }
        });
    }

    return (
        <main style={mainStyle}>
            <header style={headerStyle}>
                <h1>🏠 Wyszukiwarka mieszkań</h1>
            </header>

            <section style={searchSectionStyle}>
                <h2>Znajdź swoją wymarzoną nieruchomość</h2>
                <form onSubmit={handleSearch} style={formStyle}>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Wpisz nazwę miasta..."
                        style={inputStyle}
                    />
                    <button type="submit" style={searchButtonStyle}>Szukaj</button>
                </form>
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

const formStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center'
}

const inputStyle = {
    padding: '0.5rem',
    fontSize: '1rem',
    width: '300px',
}

const searchButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
}

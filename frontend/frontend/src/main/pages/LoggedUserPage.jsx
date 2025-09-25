import { useState, useEffect } from 'react'
import { getFavorites } from '../api/favoritesApi.js'
import ApartmentList from '../components/ApartmentList.jsx'

export default function LoggedUserPage() {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('favorites')
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        loadFavorites()
    }, [])

    const loadFavorites = async () => {
        try {
            const response = await getFavorites(userId)
            setFavorites(response.data)
            setLoading(false)
        } catch (err) {
            console.error('Failed to load favorites:', err)
            setLoading(false)
        }
    }

    if (loading) return <div>Ładowanie...</div>

    return (
        <main style={mainStyle}>
            <nav style={navStyle}>
                <button
                    style={activeTab === 'favorites' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('favorites')}
                >
                    Obserwowane nieruchomości
                </button>
                <button
                    style={activeTab === 'settings' ? activeTabStyle : tabStyle}
                    onClick={() => setActiveTab('settings')}
                >
                    Ustawienia konta
                </button>
            </nav>

            {activeTab === 'favorites' ? (
                <section>
                    <h2>Obserwowane nieruchomości</h2>
                    {favorites.length > 0 ? (
                        <ApartmentList
                            apartments={favorites}
                            onSelect={() => {}}
                            onToggleFavorite={loadFavorites}
                            favorites={favorites.map(f => f.mieszkanieId)}
                        />
                    ) : (
                        <p>Brak obserwowanych nieruchomości</p>
                    )}
                </section>
            ) : (
                <section style={sectionStyle}>
                    <h2>Ustawienia konta</h2>
                    <form style={formStyle}>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="phone">Telefon:</label>
                            <input type="tel" id="phone" style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="birthdate">Data urodzenia:</label>
                            <input type="date" id="birthdate" style={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="newPassword">Nowe hasło:</label>
                            <input type="password" id="newPassword" style={inputStyle} />
                        </div>
                        <button type="submit" style={buttonStyle}>Zapisz zmiany</button>
                    </form>
                </section>
            )}
        </main>
    )
}

const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
}

const navStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
}

const tabStyle = {
    padding: '0.6rem 1rem',
    backgroundColor: '#fff',
    color: '#646cff',
    border: '1px solid #646cff',
    borderRadius: '6px',
    cursor: 'pointer'
}

const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#646cff',
    color: '#fff'
}

const sectionStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}

const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '400px'
}

const inputStyle = {
    width: '100%',
    padding: '0.6rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc'
}

const buttonStyle = {
    padding: '0.6rem 1rem',
    backgroundColor: '#646cff',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
}
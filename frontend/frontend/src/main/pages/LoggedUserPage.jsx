import { useState } from 'react'
import { useFavorites } from '../hooks/useFavorites'
import ApartmentList from '../components/ApartmentList.jsx'
import { changePassword } from '../api/userApi'

export default function LoggedUserPage() {
    const { favorites, fullFavorites, loading, error, handleToggleFavorite } = useFavorites({ loadFullData: true })
    const [activeTab, setActiveTab] = useState('favorites')

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [message, setMessage] = useState('')

    const handleApartmentSelect = (id) => {
        window.location.href = `/apartments/${id}`
    }

    const handlePasswordChange = async (e) => {
        e.preventDefault()

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage('Hasła nie są identyczne')
            return
        }

        try {
            const login = localStorage.getItem('login')

            await changePassword(login, passwordForm.oldPassword, passwordForm.newPassword)
            setMessage('Hasło zostało zmienione')
            setPasswordForm({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error) {
            console.error(error)
            setMessage(error.response?.data || 'Wystąpił błąd')
        }
    }

    if (loading) return <div>Ładowanie...</div>
    if (error) return <div>Błąd: {error}</div>

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
                    {fullFavorites.length > 0 ? (
                        <ApartmentList
                            apartments={fullFavorites}
                            onSelect={handleApartmentSelect}
                            onToggleFavorite={handleToggleFavorite}
                            favorites={favorites}
                        />
                    ) : (
                        <p>Brak obserwowanych nieruchomości</p>
                    )}
                </section>
            ) : (
                <section style={sectionStyle}>
                    <h2>Ustawienia konta</h2>
                    <form onSubmit={handlePasswordChange} style={formStyle}>
                        <h3>Zmiana hasła</h3>
                        {message && <p style={messageStyle}>{message}</p>}
                        <div>
                            <label htmlFor="oldPassword">Obecne hasło:</label>
                            <input
                                type="password"
                                id="oldPassword"
                                value={passwordForm.oldPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword">Nowe hasło:</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Potwierdź nowe hasło:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <button type="submit" style={buttonStyle}>Zmień hasło</button>
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

const messageStyle = {
    color: 'red',
    fontWeight: 'bold'
}

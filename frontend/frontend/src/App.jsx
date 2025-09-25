import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import HomePage from './main/pages/HomePage'
import UserPage from './main/pages/UserPage'
import ApartmentPage from './main/pages/ApartmentPage'
import ApartmentDetailsPage from './main/pages/ApartmentDetailsPage'
import LoggedUserPage from './main/pages/LoggedUserPage'
import { useState } from 'react'
import ProfileIcon from './main/components/ProfileIcon'


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('userId'))

    const handleLogout = () => {
        setIsLoggedIn(false)
        localStorage.clear()
        window.location.href = '/'
    }

    const handleProfileClick = () => {
        if (isLoggedIn) {
            window.location.href = '/logged'
        } else {
            window.location.href = '/users'
        }
    }

    return (
        <BrowserRouter>
            <div style={appStyle}>
                <nav style={navStyle}>
                    <div style={navLinksStyle}>
                        <Link to="/" style={linkStyle}>Strona Główna</Link>
                        <Link to="/apartments" style={linkStyle}>Nieruchomości</Link>
                    </div>
                    <div style={profileStyle}>
                        <ProfileIcon
                            isLoggedIn={isLoggedIn}
                            onClick={handleProfileClick}
                        />
                        {isLoggedIn && (
                            <button onClick={handleLogout} style={logoutStyle}>
                                Wyloguj
                            </button>
                        )}
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/users" element={<UserPage setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/apartments" element={<ApartmentPage />} />
                    <Route path="/apartments/:id" element={<ApartmentDetailsPage />} />
                    <Route path="/logged" element={<LoggedUserPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

const appStyle = {
    minHeight: '100vh'
}

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px'
}

const navLinksStyle = {
    display: 'flex',
    gap: '1rem'
}

const profileStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
}

const logoutStyle = {
    background: 'none',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer'
}

const navStyle = {
    backgroundColor: '#333',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
}
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import UserPage from './main/pages/UserPage'
import ApartmentPage from './main/pages/ApartmentPage'

export default function App() {
    return (
        <BrowserRouter>
            <div style={appStyle}>
                <nav style={navStyle}>
                    <Link to="/users" style={linkStyle}>Users</Link>
                    <Link to="/apartments" style={linkStyle}>Apartments</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<ApartmentPage />} />
                    <Route path="/users" element={<UserPage />} />
                    <Route path="/apartments" element={<ApartmentPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

const appStyle = {
    minHeight: '100vh'
}

const navStyle = {
    backgroundColor: '#333',
    padding: '1rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
}

const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px'
}
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
            import HomePage from './main/pages/HomePage'
            import UserPage from './main/pages/UserPage'
            import ApartmentPage from './main/pages/ApartmentPage'
            import { useState } from 'react'

            export default function App() {
                const [isLoggedIn, setIsLoggedIn] = useState(false)

                const handleLogout = () => {
                    setIsLoggedIn(false)
                    localStorage.clear()
                }

                return (
                    <BrowserRouter>
                        <div style={appStyle}>
                            <nav style={navStyle}>
                                <Link to="/" style={linkStyle}>Strona Główna</Link>
                                <Link to="/users" style={linkStyle}>Użytkownik</Link>
                                <Link to="/apartments" style={linkStyle}>Nieruchomości</Link>
                            </nav>

                            <Routes>
                                <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
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
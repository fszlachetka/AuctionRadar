// frontend/frontend/src/main/pages/UserPage.jsx
import { useUserManager } from '../hooks/useUserManager.js'
import UserCard from '../components/UserCard.jsx'

export default function UserPage() {
    const {
        login: registerLogin, setLogin: setRegisterLogin,
        passwd: registerPasswd, setPasswd: setRegisterPasswd,
        foundLogin, setFoundLogin,
        foundPasswd, setFoundPasswd,
        foundUser,
        handleCreate: handleRegister,
        handleLogin: handleLogin,
    } = useUserManager()

    return (
        <main style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            color: '#333',
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>👤 User Manager</h1>

            {/* Rejestracja */}
            <section style={{ marginBottom: '2rem' }}>
                <h2>Register</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        placeholder="Login"
                        value={registerLogin}
                        onChange={e => setRegisterLogin(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={registerPasswd}
                        onChange={e => setRegisterPasswd(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={handleRegister} style={buttonStyle}>
                        Register
                    </button>
                </div>
            </section>

            {/* Logowanie */}
            <section style={{ marginBottom: '2rem' }}>
                <h2>Login</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        placeholder="Login"
                        value={foundLogin}
                        onChange={e => setFoundLogin(e.target.value)}
                        style={inputStyle}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={foundPasswd}
                        onChange={e => setFoundPasswd(e.target.value)}
                        style={inputStyle}
                    />
                    <button onClick={handleLogin} style={buttonStyle}>
                        Login
                    </button>
                </div>
            </section>

            {/* Wyświetlanie zalogowanego użytkownika */}
            {foundUser && (
                <section>
                    <h2>Logged User</h2>
                    <UserCard user={foundUser} />
                </section>
            )}
        </main>
    )
}

const inputStyle = {
    padding: '0.6rem 1rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
}

const buttonStyle = {
    padding: '0.6rem 1rem',
    backgroundColor: '#646cff',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
}
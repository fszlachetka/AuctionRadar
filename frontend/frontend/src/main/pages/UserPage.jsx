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
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>👤 Witaj ponownie!</h1>

            {/* rejestracja */}
            <section style={{ marginBottom: '2rem' }}>
                <h2>Rejestracja</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        handleRegister();
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <input
                        placeholder="Login"
                        value={registerLogin}
                        onChange={(e) => setRegisterLogin(e.target.value)}
                        style={inputStyle}
                        autoComplete="username"
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={registerPasswd}
                        onChange={(e) => setRegisterPasswd(e.target.value)}
                        style={inputStyle}
                        autoComplete="new-password"
                    />
                    <button type="submit" style={buttonStyle}>
                        Register
                    </button>
                </form>
            </section>

            {/* logowanie */}
            <section style={{ marginBottom: '2rem' }}>
                <h2>Logowanie</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        handleLogin();
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <input
                        placeholder="Login"
                        value={foundLogin}
                        onChange={(e) => setFoundLogin(e.target.value)}
                        style={inputStyle}
                        autoComplete="username"
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={foundPasswd}
                        onChange={(e) => setFoundPasswd(e.target.value)}
                        style={inputStyle}
                        autoComplete="current-password"
                    />
                    <button type="submit" style={buttonStyle}>
                        Login
                    </button>
                </form>
            </section>

            {/* wyświetlanie zalogowanego usera */}
            {foundUser && (
                <section>
                    <h2>Zalogowany użytkownik</h2>
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
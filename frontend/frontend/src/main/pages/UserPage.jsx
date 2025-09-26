import { useUserManager } from '../hooks/useUserManager.js'

export default function UserPage({ setIsLoggedIn }) {
    const {
        login,
        setLogin,
        passwd,
        setPasswd,
        foundLogin,
        setFoundLogin,
        foundPasswd,
        setFoundPasswd,
        handleCreate,
        handleLogin
    } = useUserManager()

    return (
        <main style={mainStyle}>
            <div style={formContainerStyle}>
                <section style={sectionStyle}>
                    <h2>Register</h2>
                    <div style={formGroupStyle}>
                        <input
                            type="text"
                            placeholder="Login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            value={passwd}
                            onChange={(e) => setPasswd(e.target.value)}
                            style={inputStyle}
                        />
                        <button onClick={handleCreate} style={buttonStyle}>
                            Register
                        </button>
                    </div>
                </section>

                <section style={sectionStyle}>
                    <h2>Login</h2>
                    <div style={formGroupStyle}>
                        <input
                            type="text"
                            placeholder="Login"
                            value={foundLogin}
                            onChange={(e) => setFoundLogin(e.target.value)}
                            style={inputStyle}
                        />
                        <input
                            type="password"
                            placeholder="Hasło"
                            value={foundPasswd}
                            onChange={(e) => setFoundPasswd(e.target.value)}
                            style={inputStyle}
                        />
                        <button onClick={() => handleLogin(setIsLoggedIn)} style={buttonStyle}>
                            Login
                        </button>
                    </div>
                </section>
            </div>
        </main>
    )
}

const mainStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
}

const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '400px',
    margin: '0 auto'
}

const sectionStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}

const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
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
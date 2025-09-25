export default function ProfileIcon({ isLoggedIn, onClick }) {
    return (
        <button
            onClick={onClick}
            style={iconStyle}
            title={isLoggedIn ? 'Profil użytkownika' : 'Zaloguj się'}
        >
            {isLoggedIn ? '👤' : '🔒'}
        </button>
    )
}

const iconStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#fff',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}
export default function UserCard({ user }) {
    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h3>Użytkownik:</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
    )
}

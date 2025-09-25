export default function ApartmentList({ apartments, onSelect, onToggleFavorite, favorites }) {
    return (
        <div className="apartment-list">
            {apartments.map(apt => (
                <div
                    key={apt.mieszkanieId}
                    className="apartment-card"
                    style={cardStyle}
                >
                    <div onClick={() => onSelect(apt.mieszkanieId)}>
                        <h3>{apt.miasto}, {apt.ulica} {apt.numer}/{apt.numerMieszkania}</h3>
                        <div style={detailsStyle}>
                            <p>Cena: {apt.cena.toLocaleString()} PLN</p>
                            <p>Rozmiar: {apt.rozmiar} m²</p>
                            <p>Pokoje: {apt.pokoje}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onToggleFavorite(apt.mieszkanieId)}
                        style={favoriteButtonStyle}
                    >
                        {favorites.includes(apt.mieszkanieId) ? '❤️' : '🤍'}
                    </button>
                </div>
            ))}
        </div>
    );
}

const favoriteButtonStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
};

const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: '#fff'
}

const detailsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
}
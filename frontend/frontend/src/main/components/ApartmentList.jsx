export default function ApartmentList({ apartments, onSelect }) {
    return (
        <div className="apartment-list">
            {apartments.map(apt => (
                <div
                    key={apt.mieszkanieId}
                    className="apartment-card"
                    onClick={() => onSelect(apt.mieszkanieId)}
                    style={cardStyle}
                >
                    <h3>{apt.miasto}, {apt.ulica} {apt.numer}/{apt.numerMieszkania}</h3>
                    <div style={detailsStyle}>
                        <p>Price: {apt.cena.toLocaleString()} PLN</p>
                        <p>Size: {apt.rozmiar} m²</p>
                        <p>Rooms: {apt.pokoje}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

const cardStyle = {
    padding: '1rem',
    margin: '1rem 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s',
    ':hover': {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }
}

const detailsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
}
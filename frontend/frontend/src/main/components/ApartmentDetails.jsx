export default function ApartmentDetails({ apartment, onClose }) {
    if (!apartment) return null

    return (
        <div style={detailsStyle} data-testid="apartment-details">
            <div style={headerStyle}>
                <h2>Szczegóły mieszkania</h2>
                <button onClick={onClose} style={closeButtonStyle}>×</button>
            </div>
            <div style={contentStyle}>
                <h3>{apartment.miasto}, {apartment.ulica} {apartment.numer}/{apartment.numerMieszkania}</h3>
                <p data-testid="details-price">Price: {apartment.cena.toLocaleString()} PLN</p>
                <p data-testid="details-size">Size: {apartment.rozmiar} m²</p>
                <p data-testid="details-rooms">Rooms: {apartment.pokoje}</p>
            </div>
        </div>
    )
}
const detailsStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    width: '90%',
    color: '#333'
}

const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    color: '#333'
}

const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#333'
}

const contentStyle = {
    marginTop: '1rem',
    color: '#333'
}
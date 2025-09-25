import { useState } from 'react'

export default function ApartmentFilter({ onFilter }) {
    const [filters, setFilters] = useState({
        miasto: '',
        kodPocztowy: '',
        ulica: '',
        numer: '',
        numerMieszkania: '',
        nrDzialki: '',
        nrKsiegiWieczystej: '',
        minCena: '',
        maxCena: '',
        minWadium: '',
        maxWadium: '',
        minRozmiar: '',
        maxRozmiar: '',
        minPokoje: '',
        maxPokoje: '',
        minPietro: '',
        maxPietro: '',
        hasPiwinca: false,
        prawo: '',
        minTerminOgledzin: '',
        maxTerminOgledzin: ''
    })

    const [sortBy, setSortBy] = useState('none')
    const [isExpanded, setIsExpanded] = useState(false)

    const applyFilters = (filters, sort) => {
        const filterData = {
            ...filters,
            minCena: filters.minCena ? parseFloat(filters.minCena) : null,
            maxCena: filters.maxCena ? parseFloat(filters.maxCena) : null,
            minWadium: filters.minWadium ? parseFloat(filters.minWadium) : null,
            maxWadium: filters.maxWadium ? parseFloat(filters.maxWadium) : null,
            minRozmiar: filters.minRozmiar ? parseFloat(filters.minRozmiar) : null,
            maxRozmiar: filters.maxRozmiar ? parseFloat(filters.maxRozmiar) : null,
            minPokoje: filters.minPokoje ? parseInt(filters.minPokoje) : null,
            maxPokoje: filters.maxPokoje ? parseInt(filters.maxPokoje) : null,
            minPietro: filters.minPietro ? parseInt(filters.minPietro) : null,
            maxPietro: filters.maxPietro ? parseInt(filters.maxPietro) : null
        }
        onFilter(filterData, sort)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        applyFilters(filters, sortBy)
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSortChange = (e) => {
        const value = e.target.value
        setSortBy(value)
        applyFilters(filters, value) // od razu sortuje
    }

    const handleReset = () => {
        const resetFilters = {
            miasto: '',
            kodPocztowy: '',
            ulica: '',
            numer: '',
            numerMieszkania: '',
            nrDzialki: '',
            nrKsiegiWieczystej: '',
            minCena: '',
            maxCena: '',
            minWadium: '',
            maxWadium: '',
            minRozmiar: '',
            maxRozmiar: '',
            minPokoje: '',
            maxPokoje: '',
            minPietro: '',
            maxPietro: '',
            hasPiwinca: false,
            prawo: '',
            minTerminOgledzin: '',
            maxTerminOgledzin: ''
        }
        setFilters(resetFilters)
        setSortBy('none')
        onFilter(resetFilters, 'none')
    }

    return (
        <div style={containerStyle}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={toggleButtonStyle}
            >
                {isExpanded ? 'Ukryj filtry ▲' : 'Pokaż filtry ▼'}
            </button>

            <div style={{
                ...filterPanelStyle,
                maxHeight: isExpanded ? '2000px' : '0',
                opacity: isExpanded ? '1' : '0',
                visibility: isExpanded ? 'visible' : 'hidden'
            }}>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={columnsStyle}>
                        <div style={columnStyle}>
                            <h3>Lokalizacja</h3>
                            <input type="text" name="miasto" placeholder="Miasto" value={filters.miasto} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="kodPocztowy" placeholder="Kod pocztowy" value={filters.kodPocztowy} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="ulica" placeholder="Ulica" value={filters.ulica} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="numer" placeholder="Numer" value={filters.numer} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="numerMieszkania" placeholder="Numer mieszkania" value={filters.numerMieszkania} onChange={handleInputChange} style={inputStyle} />
                        </div>

                        <div style={columnStyle}>
                            <h3>Cena i wadium</h3>
                            <input type="number" name="minCena" placeholder="Min cena" value={filters.minCena} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="maxCena" placeholder="Max cena" value={filters.maxCena} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="minWadium" placeholder="Min wadium" value={filters.minWadium} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="maxWadium" placeholder="Max wadium" value={filters.maxWadium} onChange={handleInputChange} style={inputStyle} />
                        </div>

                        <div style={columnStyle}>
                            <h3>Parametry</h3>
                            <input type="number" name="minRozmiar" placeholder="Min rozmiar" value={filters.minRozmiar} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="maxRozmiar" placeholder="Max rozmiar" value={filters.maxRozmiar} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="minPokoje" placeholder="Min pokoje" value={filters.minPokoje} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="maxPokoje" placeholder="Max pokoje" value={filters.maxPokoje} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="minPietro" placeholder="Min piętro" value={filters.minPietro} onChange={handleInputChange} style={inputStyle} />
                            <input type="number" name="maxPietro" placeholder="Max piętro" value={filters.maxPietro} onChange={handleInputChange} style={inputStyle} />
                        </div>

                        <div style={columnStyle}>
                            <h3>Dokumenty</h3>
                            <input type="text" name="nrDzialki" placeholder="Nr działki" value={filters.nrDzialki} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="nrKsiegiWieczystej" placeholder="Nr księgi wieczystej" value={filters.nrKsiegiWieczystej} onChange={handleInputChange} style={inputStyle} />
                            <input type="text" name="prawo" placeholder="Prawo własności" value={filters.prawo} onChange={handleInputChange} style={inputStyle} />
                            <div style={checkboxStyle}>
                                <input type="checkbox" name="hasPiwinca" checked={filters.hasPiwinca} onChange={handleInputChange} />
                                <label>Piwnica</label>
                            </div>
                        </div>

                        <div style={columnStyle}>
                            <h3>Termin oględzin</h3>
                            <input type="datetime-local" name="minTerminOgledzin" value={filters.minTerminOgledzin} onChange={handleInputChange} style={inputStyle} />
                            <input type="datetime-local" name="maxTerminOgledzin" value={filters.maxTerminOgledzin} onChange={handleInputChange} style={inputStyle} />
                            <h3>Sortowanie</h3>
                            <select name="sortBy" value={sortBy} onChange={handleSortChange} style={inputStyle}>
                                <option value="none">Brak sortowania</option>
                                <option value="price_asc">Cena rosnąco</option>
                                <option value="price_desc">Cena malejąco</option>
                                <option value="size_asc">Rozmiar rosnąco</option>
                                <option value="size_desc">Rozmiar malejąco</option>
                                <option value="city_asc">Miasto A-Z</option>
                                <option value="city_desc">Miasto Z-A</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" style={buttonStyle}>Filtruj</button>
                        <button type="button" onClick={handleReset} style={{ ...buttonStyle, backgroundColor: '#999' }}>Resetuj</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const containerStyle = {
    marginBottom: '1rem'
}

const toggleButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#646cff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '0.5rem'
}

const filterPanelStyle = {
    overflow: 'hidden',
    transition: 'all 0.3s ease'
}

const formStyle = {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
}

const columnsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginBottom: '1rem'
}

const columnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
}

const inputStyle = {
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem'
}

const checkboxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
}

const buttonStyle = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#646cff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
}

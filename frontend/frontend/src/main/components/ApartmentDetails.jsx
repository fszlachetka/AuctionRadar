import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function ApartmentDetails({ apartment }) {
    const mapContainerRef = useRef(null)

    useEffect(() => {
        if (!apartment || !mapContainerRef.current) return

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://tiles.stadiamaps.com/styles/osm_bright.json',
            center: [apartment.xcoord, apartment.ycoord],
            zoom: 15
        })

        new maplibregl.Marker()
            .setLngLat([apartment.xcoord, apartment.ycoord])
            .addTo(map)

        return () => map.remove()
    }, [apartment])

    if (!apartment) return <div>Loading...</div>

    return (
        <div style={containerStyle}>
            <div style={contentStyle}>
                <section style={sectionStyle}>
                    <h1>{apartment.miasto}, {apartment.ulica} {apartment.numer}/{apartment.numerMieszkania}</h1>
                    <div style={priceStyle}>
                        <h2>{apartment.cena.toLocaleString()} PLN</h2>
                        {apartment.wadium > 0 && (
                            <p>Wadium: {apartment.wadium.toLocaleString()} PLN</p>
                        )}
                    </div>
                </section>

                <section style={sectionStyle}>
                    <h3>Informacje o nieruchomości</h3>
                    <div style={gridStyle}>
                        <div>
                            <p>Powierzchnia</p>
                            <strong>{apartment.rozmiar} m²</strong>
                        </div>
                        <div>
                            <p>Liczba pokoi</p>
                            <strong>{apartment.pokoje}</strong>
                        </div>
                        <div>
                            <p>Piętro</p>
                            <strong>{apartment.pietro}</strong>
                        </div>
                        <div>
                            <p>Piwnica</p>
                            <strong>{apartment.piwnica ? 'Tak' : 'Nie'}</strong>
                        </div>
                    </div>
                </section>

                <section style={sectionStyle}>
                    <h3>Szczegóły lokalizacji</h3>
                    <div style={gridStyle}>
                        <div>
                            <p>Kod pocztowy</p>
                            <strong>{apartment.kodPocztowy}</strong>
                        </div>
                        <div>
                            <p>Nr działki</p>
                            <strong>{apartment.nrDzialki}</strong>
                        </div>
                        <div>
                            <p>Nr księgi wieczystej</p>
                            <strong>{apartment.nrKsiegiWieczystej}</strong>
                        </div>
                    </div>
                </section>

                <section style={sectionStyle}>
                    <h3>Informacje prawne</h3>
                    <div style={gridStyle}>
                        <div>
                            <p>Forma własności</p>
                            <strong>{apartment.prawo}</strong>
                        </div>
                        {apartment.terminOgledzin && (
                            <div>
                                <p>Termin oględzin</p>
                                <strong>
                                    {new Date(apartment.terminOgledzin).toLocaleString('pl-PL', {
                                        dateStyle: 'medium',
                                        timeStyle: 'short'
                                    })}
                                </strong>
                            </div>
                        )}
                    </div>
                </section>

                {apartment.inne && (
                    <section style={sectionStyle}>
                        <h3>Dodatkowe informacje</h3>
                        <p>{apartment.inne}</p>
                    </section>
                )}
            </div>

            <div style={mapContainerStyle} ref={mapContainerRef}/>
        </div>
    )
}

const containerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '2rem auto',
    padding: '0 1rem'
}

const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
}

const sectionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
}

const priceStyle = {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
}

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 0.5fr))',
    gap: '0.5rem',
    marginTop: '0.5rem'
}

const mapContainerStyle = {
    height: '100%',
    minHeight: '500px',
    borderRadius: '8px',
    overflow: 'hidden'
}
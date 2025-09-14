import { render, screen } from '@testing-library/react'
import ApartmentDetails from '../../../main/components/ApartmentDetails'

describe('ApartmentDetails', () => {
    const mockApartment = {
        mieszkanieId: 1,
        miasto: 'Warszawa',
        ulica: 'Marszałkowska',
        numer: '10',
        numerMieszkania: '15',
        cena: 550000,
        rozmiar: 55,
        pokoje: 3
    }

    test('renders apartment details', () => {
        render(<ApartmentDetails apartment={mockApartment} onClose={() => {}} />)

        // Test for individual elements instead of the combined text
        expect(screen.getByText('Apartment Details')).toBeInTheDocument()
        expect(screen.getByText(/Warszawa/)).toBeInTheDocument()
        expect(screen.getByText(/Marszałkowska/)).toBeInTheDocument()
        expect(screen.getByText(/550,000 PLN/)).toBeInTheDocument()
        expect(screen.getByText(/55 m²/)).toBeInTheDocument()
        expect(screen.getByText(/3/)).toBeInTheDocument()
    })

    test('does not render when apartment is null', () => {
        const { container } = render(<ApartmentDetails apartment={null} onClose={() => {}} />)
        expect(container).toBeEmptyDOMElement()
    })
})
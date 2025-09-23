import { render, screen, fireEvent } from '@testing-library/react'
import ApartmentList from '../../../main/components/ApartmentList'

describe('ApartmentList', () => {
    const mockApartments = [
        {
            mieszkanieId: 1,
            miasto: "Warszawa",
            ulica: "Marszałkowska",
            numer: "10",
            numerMieszkania: "15",
            cena: 550000,
            rozmiar: 55,
            pokoje: 3
        }
    ]

    test('renders apartment cards', () => {
        const onSelect = vi.fn()
        render(<ApartmentList apartments={mockApartments} onSelect={onSelect} />)

        expect(screen.getByText('Warszawa, Marszałkowska 10/15')).toBeInTheDocument()
        expect(screen.getByText('Price: 550,000 PLN')).toBeInTheDocument()
        expect(screen.getByText('Size: 55 m²')).toBeInTheDocument()
        expect(screen.getByText('Rooms: 3')).toBeInTheDocument()
    })

    test('calls onSelect with correct id when clicked', () => {
        const onSelect = vi.fn()
        render(<ApartmentList apartments={mockApartments} onSelect={onSelect} />)

        fireEvent.click(screen.getByText('Warszawa, Marszałkowska 10/15'))
        expect(onSelect).toHaveBeenCalledWith(1)
    })
})
// frontend/frontend/src/test/integrationTests/pages/ApartmentPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ApartmentPage from '../../../main/pages/ApartmentPage'
import * as apartmentApi from '../../../main/api/apartmentApi'

//vi.mock('../../../main/api/apartmentApi')

// frontend/frontend/src/test/integrationTests/pages/ApartmentPage.test.jsx
import { mockApartments } from '../../mocks/apartments'

vi.mock('../../../main/api/apartmentApi', () => ({
    getAllApartments: vxi.fn().mockResolvedValue({ data: mockApartments }),
    getApartmentById: vi.fn().mockImplementation((id) => ({
        data: mockApartments.find(apt => apt.mieszkanieId === id)
    }))
}))

describe('ApartmentPage', () => {
    const mockApartments = [
        {
            mieszkanieId: 1,
            miasto: 'Warszawa',
            ulica: 'Marszałkowska',
            numer: '10',
            numerMieszkania: '15',
            cena: 550000,
            rozmiar: 55,
            pokoje: 3
        }
    ]

    beforeEach(() => {
        apartmentApi.getAllApartments.mockResolvedValue({ data: mockApartments })
        apartmentApi.getApartmentById.mockResolvedValue({ data: mockApartments[0] })
    })

    test('shows apartment list', async () => {
        render(<ApartmentPage />)

        await waitFor(() => {
            expect(screen.getByText('Available Apartments')).toBeInTheDocument()
            expect(screen.getByText(/Warszawa, Marszałkowska/)).toBeInTheDocument()
        })
    })

    test('shows apartment details when apartment is selected', async () => {
        render(<ApartmentPage />)

        // Wait for the list to load
        await waitFor(() => {
            expect(screen.getByText(/Warszawa, Marszałkowska/)).toBeInTheDocument()
        })

        // Click on the apartment card
        fireEvent.click(screen.getByText(/Warszawa, Marszałkowska/))

        // Verify details modal appears with specific content
        await waitFor(() => {
            const details = screen.getByTestId('apartment-details')
            expect(details).toBeInTheDocument()
            expect(screen.getByTestId('details-price')).toHaveTextContent('550,000 PLN')
            expect(screen.getByTestId('details-size')).toHaveTextContent('55 m²')
            expect(screen.getByTestId('details-rooms')).toHaveTextContent('Rooms: 3')
        })
    })

    test('shows loading state', () => {
        render(<ApartmentPage />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('shows error state', async () => {
        apartmentApi.getAllApartments.mockRejectedValue(new Error('Failed to load'))
        render(<ApartmentPage />)

        await waitFor(() => {
            expect(screen.getByText(/Error:/)).toBeInTheDocument()
        })
    })
})
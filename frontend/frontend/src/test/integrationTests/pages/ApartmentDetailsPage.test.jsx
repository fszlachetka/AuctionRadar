import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ApartmentDetailsPage from '../../../main/pages/ApartmentDetailsPage'
import * as apartmentApi from '../../../main/api/apartmentApi'
import ApartmentDetails from '../../../main/components/ApartmentDetails'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../../../main/api/apartmentApi')
vi.mock('../../../main/components/ApartmentDetails', () => ({
    __esModule: true,
    default: ({ apartment, onClose }) => (
        <div>
            <div>Apartment: {apartment.miasto}</div>
            <button onClick={onClose}>Close</button>
        </div>
    )
}))

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useParams: () => ({ id: '1' }),
        useNavigate: () => mockNavigate
    }
})

describe('ApartmentDetailsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('shows loading state initially', () => {
        apartmentApi.getApartmentById.mockReturnValue(new Promise(() => {})) // never resolves
        render(
            <MemoryRouter>
                <ApartmentDetailsPage />
            </MemoryRouter>
        )
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('renders apartment details when loaded', async () => {
        const mockApartment = { mieszkanieId: 1, miasto: 'Warszawa' }
        apartmentApi.getApartmentById.mockResolvedValue({ data: mockApartment })

        render(
            <MemoryRouter>
                <ApartmentDetailsPage />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Apartment: Warszawa')).toBeInTheDocument()
        })
    })

    test('shows error message when API fails', async () => {
        apartmentApi.getApartmentById.mockRejectedValue(new Error('API error'))

        render(
            <MemoryRouter>
                <ApartmentDetailsPage />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText(/Nie udało się załadować szczegółów nieruchomości/)).toBeInTheDocument()
        })
    })

    test('calls navigate when close button clicked', async () => {
        const mockApartment = { mieszkanieId: 1, miasto: 'Warszawa' }
        apartmentApi.getApartmentById.mockResolvedValue({ data: mockApartment })

        render(
            <MemoryRouter>
                <ApartmentDetailsPage />
            </MemoryRouter>
        )

        await waitFor(() => screen.getByText('Close'))

        fireEvent.click(screen.getByText('Close'))

        expect(mockNavigate).toHaveBeenCalledWith('/apartments')
    })
})

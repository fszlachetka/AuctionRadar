import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ApartmentPage from '../../../main/pages/ApartmentPage'
import { useApartments } from '../../../main/hooks/useApartments'
import * as favoritesApi from '../../../main/api/favoritesApi'
import { filterApartments } from '../../../main/api/apartmentApi'
import { MemoryRouter } from 'react-router-dom'

vi.mock('maplibre-gl', () => ({
    default: {
        Map: vi.fn(() => ({
            on: vi.fn(),
            remove: vi.fn(),
            addSource: vi.fn(),
            addLayer: vi.fn(),
            getBounds: vi.fn(() => ({
                getWest: () => 20,
                getEast: () => 22,
                getSouth: () => 51,
                getNorth: () => 53
            }))
        }))
    }
}))

vi.mock('../../../main/hooks/useApartments')
vi.mock('../../../main/api/favoritesApi')
vi.mock('../../../main/api/apartmentApi')

const mockApartments = [
    {
        mieszkanieId: 1,
        miasto: 'Warszawa',
        ulica: 'Marszałkowska',
        numer: '10',
        numerMieszkania: '15',
        cena: 550000,
        rozmiar: 55,
        pokoje: 3,
        xcoord: 21.0,
        ycoord: 52.0
    }
]

describe('ApartmentPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        useApartments.mockReturnValue({
            apartments: mockApartments,
            selectedApartment: null,
            loading: false,
            error: null,
            selectApartment: vi.fn(),
            setApartments: vi.fn()
        })
        favoritesApi.getFavorites.mockResolvedValue({ data: [] })
        filterApartments.mockResolvedValue({ data: mockApartments })
        localStorage.setItem('userId', '1')
    })

    test('render map toggle button', () => {
        render(
            <MemoryRouter>
                <ApartmentPage />
            </MemoryRouter>
        )
        const toggleButton = screen.getByRole('button', { name: /Pokaż mapę/i })
        expect(toggleButton).toBeInTheDocument()
    })

    test('filter apartments based on form input', async () => {
        render(
            <MemoryRouter>
                <ApartmentPage />
            </MemoryRouter>
        )

        const filterButton = screen.getByText('Filtruj')
        fireEvent.click(filterButton)

        await waitFor(() => {
            expect(filterApartments).toHaveBeenCalled()
        })
    })

    test('handle favorite when logged in', async () => {
        render(
            <MemoryRouter>
                <ApartmentPage />
            </MemoryRouter>
        )

        const favoriteButton = screen.getByText('🤍')
        fireEvent.click(favoriteButton)

        await waitFor(() => {
            expect(favoritesApi.addToFavorites).toHaveBeenCalledWith(1, 1)
        })
    })

    test('show login alert when toggling favorites not logged in', () => {
        localStorage.removeItem('userId')
        render(
            <MemoryRouter>
                <ApartmentPage />
            </MemoryRouter>
        )

        const favoriteButton = screen.getByText('🤍')
        fireEvent.click(favoriteButton)

    })

    test('update visible apartments when apartments change', async () => {
        const { rerender } = render(
            <MemoryRouter>
                <ApartmentPage />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(
                screen.getByText('Warszawa, Marszałkowska 10/15')
            ).toBeInTheDocument()
        })

        rerender(
            <MemoryRouter>
                <ApartmentPage />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Warszawa, Marszałkowska 10/15')).toBeInTheDocument()
        })
    })
})

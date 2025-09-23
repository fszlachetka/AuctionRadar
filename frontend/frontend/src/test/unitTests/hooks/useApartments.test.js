import { renderHook, act } from '@testing-library/react'
import { useApartments } from '../../../main/hooks/useApartments'
import * as apartmentApi from '../../../main/api/apartmentApi'

vi.mock('../../../main/api/apartmentApi')

describe('useApartments', () => {
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

    beforeEach(() => {
        apartmentApi.getAllApartments.mockResolvedValue({ data: mockApartments })
        apartmentApi.getApartmentById.mockResolvedValue({ data: mockApartments[0] })
    })

    test('loads apartments on mount', async () => {
        const { result } = renderHook(() => useApartments())

        expect(result.current.loading).toBe(true)

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        expect(result.current.apartments).toEqual(mockApartments)
        expect(result.current.loading).toBe(false)
    })

    test('handles load error correctly', async () => {
        apartmentApi.getAllApartments.mockRejectedValue(new Error('Failed to load'))

        const { result } = renderHook(() => useApartments())

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        expect(result.current.error).toBe('Failed to load apartments')
        expect(result.current.loading).toBe(false)
    })

    test('selects apartment by id', async () => {
        const { result } = renderHook(() => useApartments())

        await act(async () => {
            await result.current.selectApartment(1)
        })

        expect(result.current.selectedApartment).toEqual(mockApartments[0])
    })
})
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
    })

    test('loads empty apartments', async () => {
        const { result } = renderHook(() => useApartments())

        expect(result.current.apartments).toEqual([])
        expect(result.current.loading).toBe(false)

    })

    test('handles load error correctly', async () => {
        apartmentApi.getAllApartments.mockRejectedValue(new Error('Failed to load'))

        const { result } = renderHook(() => useApartments())

        await act(async () => {
            await result.current.loadApartments()
        })

        expect(result.current.error).toBe('Failed to load apartments')
        expect(result.current.loading).toBe(false)
    })
})

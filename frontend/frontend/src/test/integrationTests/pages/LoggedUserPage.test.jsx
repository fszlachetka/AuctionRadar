import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import LoggedUserPage from '../../../main/pages/LoggedUserPage'
import * as userApi from '../../../main/api/userApi'
import * as useFavoritesHook from '../../../main/hooks/useFavorites'

vi.mock('../../../main/api/userApi')

const mockHandleToggleFavorite = vi.fn()
const mockFavorites = [1]
const mockFullFavorites = [{ mieszkanieId: 1, miasto: 'Warszawa' }]

vi.mock('../../../main/hooks/useFavorites', () => ({
    useFavorites: vi.fn(() => ({
        favorites: mockFavorites,
        fullFavorites: mockFullFavorites,
        loading: false,
        error: null,
        handleToggleFavorite: mockHandleToggleFavorite
    }))
}))

describe('LoggedUserPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.setItem('login', 'janek123')
    })

    test('renders favorite apartments', () => {
        render(<LoggedUserPage />)
        expect(screen.getByText((content) => content.includes('Warszawa'))).toBeInTheDocument()
    })

    test('displays message when no favorite apartments', () => {
        useFavoritesHook.useFavorites.mockReturnValueOnce({
            favorites: [],
            fullFavorites: [],
            loading: false,
            error: null,
            handleToggleFavorite: vi.fn()
        })

        render(<LoggedUserPage />)
        expect(screen.getByText('Brak obserwowanych nieruchomości')).toBeInTheDocument()
    })

    test('changes password successfully', async () => {
        userApi.changePassword.mockResolvedValue({})

        render(<LoggedUserPage />)

        fireEvent.click(screen.getByText('Ustawienia konta'))

        fireEvent.change(screen.getByLabelText('Obecne hasło:'), { target: { value: 'oldpass' } })
        fireEvent.change(screen.getByLabelText('Nowe hasło:'), { target: { value: 'newpass' } })
        fireEvent.change(screen.getByLabelText('Potwierdź nowe hasło:'), { target: { value: 'newpass' } })

        fireEvent.click(screen.getByText('Zmień hasło'))

        await waitFor(() => {
            expect(userApi.changePassword).toHaveBeenCalledWith('janek123', 'oldpass', 'newpass')
            expect(screen.getByText('Hasło zostało zmienione')).toBeInTheDocument()
        })
    })

    test('shows error when passwords do not match', async () => {
        render(<LoggedUserPage />)

        fireEvent.click(screen.getByText('Ustawienia konta'))

        fireEvent.change(screen.getByLabelText('Nowe hasło:'), { target: { value: 'newpass' } })
        fireEvent.change(screen.getByLabelText('Potwierdź nowe hasło:'), { target: { value: 'wrongpass' } })

        fireEvent.click(screen.getByText('Zmień hasło'))

        await waitFor(() => {
            expect(screen.getByText('Hasła nie są identyczne')).toBeInTheDocument()
        })
    })

    test('shows API error on password change failure', async () => {
        userApi.changePassword.mockRejectedValue({ response: { data: 'Błąd serwera' } })

        render(<LoggedUserPage />)

        fireEvent.click(screen.getByText('Ustawienia konta'))

        fireEvent.change(screen.getByLabelText('Obecne hasło:'), { target: { value: 'oldpass' } })
        fireEvent.change(screen.getByLabelText('Nowe hasło:'), { target: { value: 'newpass' } })
        fireEvent.change(screen.getByLabelText('Potwierdź nowe hasło:'), { target: { value: 'newpass' } })

        fireEvent.click(screen.getByText('Zmień hasło'))

        await waitFor(() => {
            expect(screen.getByText('Błąd serwera')).toBeInTheDocument()
        })
    })
})

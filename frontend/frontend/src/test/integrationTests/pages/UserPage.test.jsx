import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserPage from '../../../main/pages/UserPage'
import * as userApi from '../../../main/api/userApi'

vi.mock('../../../main/api/userApi')

describe('UserPage', () => {
    test('allows user to log in and displays user info', async () => {
        // Mock odpowiedzi z backendu
        userApi.getUserByLogin.mockResolvedValue({
            data: { login: 'janek123', passwd: 'secret123' },
        })

        render(<UserPage />)

        // Wprowadzenie danych logowania
        fireEvent.change(screen.getByPlaceholderText(/^Login$/i), {
            target: { value: 'janek123' },
        })
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
            target: { value: 'secret123' },
        })

        // Kliknięcie "Login"
        fireEvent.click(screen.getByText(/^Login$/i))

        // Oczekiwanie na pojawienie się danych użytkownika
        await waitFor(() => {
            expect(screen.getByText(/Logged User/i)).toBeInTheDocument()
            expect(screen.getByText(/janek123/)).toBeInTheDocument()
        })
    })

    test('displays error alert on invalid login', async () => {
        // Mock błędnej odpowiedzi z backendu
        userApi.getUserByLogin.mockRejectedValue(new Error('User not found'))

        render(<UserPage />)

        fireEvent.change(screen.getByPlaceholderText(/^Login$/i), {
            target: { value: '' },
        })
        fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
            target: { value: '' },
        })

        // Mockowanie window.alert
        window.alert = vi.fn()

        fireEvent.click(screen.getByText(/^Login$/i))

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('User not found')
        })
    })
})

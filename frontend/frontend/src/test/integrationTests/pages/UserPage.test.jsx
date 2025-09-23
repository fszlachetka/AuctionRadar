// frontend/frontend/src/test/integrationTests/pages/UserPage.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserPage from '../../../main/pages/UserPage'
import * as userApi from '../../../main/api/userApi'

vi.mock('../../../main/api/userApi')

describe('UserPage', () => {
    beforeEach(() => {
        window.alert = vi.fn()
    })

    test('allows user to register', async () => {
        userApi.createUser.mockResolvedValue({})

        render(<UserPage />)

        const loginInput = screen.getAllByPlaceholderText('Login')[0]
        const passwordInput = screen.getAllByPlaceholderText('Password')[0]

        fireEvent.change(loginInput, {
            target: { value: 'janek123' },
        })
        fireEvent.change(passwordInput, {
            target: { value: 'secret123' },
        })

        const registerButton = screen.getByRole('button', { name: 'Register' })
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(userApi.createUser).toHaveBeenCalledWith({
                login: 'janek123',
                passwd: 'secret123'
            })
            expect(window.alert).toHaveBeenCalledWith('User added succesfully!')
        })
    })

    test('allows user to login and display user info', async () => {
        const mockUser = { login: 'janek123', passwd: 'secret123' }
        userApi.getUserByLogin.mockResolvedValue({ data: mockUser })

        render(<UserPage />)

        const loginInput = screen.getAllByPlaceholderText('Login')[1]
        const passwordInput = screen.getAllByPlaceholderText('Password')[1]

        fireEvent.change(loginInput, {
            target: { value: 'janek123' },
        })
        fireEvent.change(passwordInput, {
            target: { value: 'secret123' },
        })

        const loginButton = screen.getByRole('button', { name: 'Login' })
        fireEvent.click(loginButton)

        await waitFor(() => {
            expect(userApi.getUserByLogin).toHaveBeenCalledWith('janek123')
            expect(screen.getByText('Logged User')).toBeInTheDocument()
            expect(screen.getByText(/"login": "janek123"/)).toBeInTheDocument()
        })
    })

    test('displays error on user not found', async () => {
        userApi.getUserByLogin.mockRejectedValue(new Error('User not found'))

        render(<UserPage />)

        const loginInput = screen.getAllByPlaceholderText('Login')[1]
        const passwordInput = screen.getAllByPlaceholderText('Password')[1]

        fireEvent.change(loginInput, {
            target: { value: 'nonexistent' },
        })
        fireEvent.change(passwordInput, {
            target: { value: 'wrongpass' },
        })

        const loginButton = screen.getByRole('button', { name: 'Login' })
        fireEvent.click(loginButton)

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('User not found')
        })
    })
})
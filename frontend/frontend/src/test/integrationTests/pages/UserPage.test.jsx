import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import UserPage from '../../../main/pages/UserPage'
import * as userApi from '../../../main/api/userApi'
import * as userHooks from '../../../main/hooks/useUserManager'

vi.mock('../../../main/api/userApi')
vi.mock('../../../main/hooks/useUserManager')

describe('UserPage', () => {
    beforeEach(() => {
        window.alert = vi.fn()
        vi.clearAllMocks()
    })

    test('allows user to register', async () => {
        userApi.createUser.mockResolvedValue({})
        const mockHandleCreate = vi.fn(async () => {
            await userApi.createUser({ login: 'janek123', passwd: 'secret123' })
            window.alert('User added succesfully!')
        })

        userHooks.useUserManager.mockReturnValue({
            login: '',
            setLogin: vi.fn(),
            passwd: '',
            setPasswd: vi.fn(),
            foundLogin: '',
            setFoundLogin: vi.fn(),
            foundPasswd: '',
            setFoundPasswd: vi.fn(),
            handleCreate: mockHandleCreate,
            handleLogin: vi.fn()
        })

        render(<UserPage />)

        const loginInput = screen.getAllByPlaceholderText('Login')[0]
        const passwordInput = screen.getAllByPlaceholderText('Hasło')[0]

        fireEvent.change(loginInput, { target: { value: 'janek123' } })
        fireEvent.change(passwordInput, { target: { value: 'secret123' } })

        const registerButton = screen.getByRole('button', { name: 'Register' })
        fireEvent.click(registerButton)

        await waitFor(() => {
            expect(mockHandleCreate).toHaveBeenCalled()
            expect(userApi.createUser).toHaveBeenCalledWith({
                login: 'janek123',
                passwd: 'secret123'
            })
            expect(window.alert).toHaveBeenCalledWith('User added succesfully!')
        })
    })

    test('allows user to login', async () => {
        const mockHandleLogin = vi.fn((setIsLoggedIn) => {
            setIsLoggedIn(true)
            window.alert('Logged in!')
        })

        userHooks.useUserManager.mockReturnValue({
            login: '',
            setLogin: vi.fn(),
            passwd: '',
            setPasswd: vi.fn(),
            foundLogin: '',
            setFoundLogin: vi.fn(),
            foundPasswd: '',
            setFoundPasswd: vi.fn(),
            handleCreate: vi.fn(),
            handleLogin: mockHandleLogin
        })

        const setIsLoggedIn = vi.fn()
        render(<UserPage setIsLoggedIn={setIsLoggedIn} />)

        const loginInput = screen.getAllByPlaceholderText('Login')[1]
        const passwordInput = screen.getAllByPlaceholderText('Hasło')[1]

        fireEvent.change(loginInput, { target: { value: 'janek123' } })
        fireEvent.change(passwordInput, { target: { value: 'secret123' } })

        const loginButton = screen.getByRole('button', { name: 'Login' })
        fireEvent.click(loginButton)

        await waitFor(() => {
            expect(mockHandleLogin).toHaveBeenCalledWith(setIsLoggedIn)
            expect(setIsLoggedIn).toHaveBeenCalledWith(true)
            expect(window.alert).toHaveBeenCalledWith('Logged in!')
        })
    })

    test('displays error on user not found', async () => {
        const mockHandleLogin = vi.fn(() => window.alert('User not found'))

        userHooks.useUserManager.mockReturnValue({
            login: '',
            setLogin: vi.fn(),
            passwd: '',
            setPasswd: vi.fn(),
            foundLogin: '',
            setFoundLogin: vi.fn(),
            foundPasswd: '',
            setFoundPasswd: vi.fn(),
            handleCreate: vi.fn(),
            handleLogin: mockHandleLogin
        })

        render(<UserPage setIsLoggedIn={vi.fn()} />)

        const loginInput = screen.getAllByPlaceholderText('Login')[1]
        const passwordInput = screen.getAllByPlaceholderText('Hasło')[1]

        fireEvent.change(loginInput, { target: { value: 'nieIstnieje' } })
        fireEvent.change(passwordInput, { target: { value: 'zleHaslo' } })

        const loginButton = screen.getByRole('button', { name: 'Login' })
        fireEvent.click(loginButton)

        await waitFor(() => {
            expect(mockHandleLogin).toHaveBeenCalled()
            expect(window.alert).toHaveBeenCalledWith('User not found')
        })
    })
})

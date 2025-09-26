import { renderHook, act } from '@testing-library/react'
import { useUserManager } from '../../../main/hooks/useUserManager'

vi.mock('../../../main/api/userApi', async () => {
    const actual = await vi.importActual('../../../main/api/userApi')
    return {
        ...actual,
        createUser: vi.fn(),
        loginUser: vi.fn()
    }
})
import * as userApi from '../../../main/api/userApi'

describe('useUserManager', () => {
    beforeEach(() => {
        window.alert = vi.fn()
        window.location.href = ''
        localStorage.clear()
    })

    test('calls createUser with correct values', async () => {
        userApi.createUser.mockResolvedValue({})
        const { result } = renderHook(() => useUserManager())

        act(() => {
            result.current.setLogin('janek')
            result.current.setPasswd('secret123')
        })

        await act(async () => {
            await result.current.handleCreate()
        })

        expect(userApi.createUser).toHaveBeenCalledWith({ login: 'janek', passwd: 'secret123' })
        expect(window.alert).toHaveBeenCalledWith('Użytkownik dodany pomyślnie!')
    })

    test('calls loginUser and sets foundUser on successful login', async () => {
        const mockResponse = {
            data: { accessToken: 'abc', refreshToken: 'xyz', userId: 1 }
        }
        userApi.loginUser.mockResolvedValue(mockResponse)

        const { result } = renderHook(() => useUserManager())

        delete window.location
        window.location = { href: '' }

        act(() => {
            result.current.setFoundLogin('janek')
            result.current.setFoundPasswd('secret123')
        })

        await act(async () => {
            await result.current.handleLogin()
        })

        expect(userApi.loginUser).toHaveBeenCalledWith('janek', 'secret123')
        expect(result.current.foundUser).toEqual({ login: 'janek' })
        expect(localStorage.getItem('login')).toBe('janek')
        expect(localStorage.getItem('userId')).toBe('1')
        expect(window.location.href).toBe('/logged')
    })

    test('alerts on login with invalid credentials', async () => {
        userApi.loginUser.mockRejectedValue(new Error('Invalid credentials'))
        const { result } = renderHook(() => useUserManager())

        act(() => {
            result.current.setFoundLogin('janek')
            result.current.setFoundPasswd('wrongpass')
        })

        await act(async () => {
            await result.current.handleLogin()
        })

        expect(window.alert).toHaveBeenCalledWith('Nieprawidłowe dane logowania')
        expect(result.current.foundUser).toBeNull()
    })
})

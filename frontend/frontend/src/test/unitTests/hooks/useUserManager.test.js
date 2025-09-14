// frontend/frontend/src/test/unitTests/hooks/useUserManager.test.js
import { renderHook, act } from '@testing-library/react'
import { useUserManager } from '../../../main/hooks/useUserManager'

vi.mock('../../../main/api/userApi', async () => {
    const actual = await vi.importActual('../../../main/api/userApi')
    return {
        ...actual,
        createUser: vi.fn(),
        getUserByLogin: vi.fn()
    }
})
import * as userApi from '../../../main/api/userApi'

describe('useUserManager', () => {
    beforeEach(() => {
        window.alert = vi.fn()
    })

    test('calls createUser with correct values', async () => {
        const mockCreate = vi.fn().mockResolvedValue({})
        userApi.createUser.mockImplementation(mockCreate)
        const { result } = renderHook(() => useUserManager())

        act(() => {
            result.current.setLogin('janek')
            result.current.setPasswd('secret123')
        })

        await act(async () => {
            await result.current.handleCreate()
        })

        expect(mockCreate).toHaveBeenCalledWith({ login: 'janek', passwd: 'secret123' })
    })

    test('validates user login with correct password', async () => {
        const mockUser = { login: 'janek', passwd: 'secret123' }
        userApi.getUserByLogin.mockResolvedValue({ data: mockUser })
        const { result } = renderHook(() => useUserManager())

        act(() => {
            result.current.setFoundLogin('janek')
            result.current.setFoundPasswd('secret123')
        })

        await act(async () => {
            await result.current.handleFind()
        })

        expect(result.current.foundUser).toEqual(mockUser)
    })

    test('rejects login with incorrect password', async () => {
        const mockUser = { login: 'janek', passwd: 'secret123' }
        userApi.getUserByLogin.mockResolvedValue({ data: mockUser })
        const { result } = renderHook(() => useUserManager())

        act(() => {
            result.current.setFoundLogin('janek')
            result.current.setFoundPasswd('wrongpass')
        })

        await act(async () => {
            await result.current.handleFind()
        })

        expect(window.alert).toHaveBeenCalledWith('Invalid password')
        expect(result.current.foundUser).toBeNull()
    })
})
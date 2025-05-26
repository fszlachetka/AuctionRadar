import { renderHook, act } from '@testing-library/react'
import { useUserManager } from '../../../main/hooks/useUserManager'
vi.mock('../../../main/api/userApi', async () => {
    const actual = await vi.importActual('../../../main/api/userApi')
    return {
        ...actual,
        createUser: vi.fn()
    }
})
import * as userApi from '../../../main/api/userApi'


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

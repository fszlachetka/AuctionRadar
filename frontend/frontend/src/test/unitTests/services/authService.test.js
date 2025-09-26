import { describe, test, expect, beforeEach, vi } from 'vitest'
import { saveTokens, getAccessToken, getRefreshToken, clearTokens } from '../../../main/services/authService'

describe('authService', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    test('saves and retrieves tokens correctly', () => {
        saveTokens({ accessToken: 'access123', refreshToken: 'refresh456' })

        expect(getAccessToken()).toBe('access123')
        expect(getRefreshToken()).toBe('refresh456')
    })

    test('clears tokens correctly', () => {
        saveTokens({ accessToken: 'access123', refreshToken: 'refresh456' })
        clearTokens()

        expect(getAccessToken()).toBeNull()
        expect(getRefreshToken()).toBeNull()
    })
})

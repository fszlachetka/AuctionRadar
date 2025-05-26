import { isValidLogin, isValidPassword } from '../../../main/services/userService'

test('validates correct login', () => {
    expect(isValidLogin('janek')).toBe(true)
})

test('rejects invalid login', () => {
    expect(isValidLogin('')).toBe(false)
})

test('validates correct password', () => {
    expect(isValidPassword('secret123')).toBe(true)
})

test('rejects invalid password', () => {
    expect(isValidPassword('')).toBe(false)
})

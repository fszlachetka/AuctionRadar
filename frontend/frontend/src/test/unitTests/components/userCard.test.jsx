// frontend/frontend/src/test/unitTests/components/userCard.test.jsx
import { render, screen } from '@testing-library/react'
import UserCard from '../../../main/components/UserCard'
import { describe, test, expect } from 'vitest'

describe('UserCard', () => {
    test('displays user data', () => {
        const user = { login: 'janek123', passwd: 'secret123' }
        render(<UserCard user={user} />)

        expect(screen.getByText(/Użytkownik:/)).toBeInTheDocument()
        expect(screen.getByText(/"login": "janek123"/)).toBeInTheDocument()
        expect(screen.getByText(/"passwd": "secret123"/)).toBeInTheDocument()
    })
})
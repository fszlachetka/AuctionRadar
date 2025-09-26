import React from 'react'
import { render, screen } from '@testing-library/react'
import UserCard from '../../../main/components/UserCard.jsx'

describe('UserCard', () => {
    test('displays "Użytkownik" text', () => {
        const user = { login: 'janek123', passwd: 'secret123' }
        render(<UserCard user={user} />)
        expect(screen.getByText(/Użytkownik/i)).toBeInTheDocument()
    })
})

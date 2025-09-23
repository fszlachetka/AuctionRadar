/** @jsxImportSource react */
import { render, screen } from '@testing-library/react'
import UserCard from '../../../main/components/UserCard'

test('displays user data', () => {
    const user = { login: 'janek123', passwd: 'secret123' }
    render(<UserCard user={user} />)

    expect(screen.getByText(/User:/i)).toBeInTheDocument()
    expect(screen.getByText(/janek123/)).toBeInTheDocument()
})

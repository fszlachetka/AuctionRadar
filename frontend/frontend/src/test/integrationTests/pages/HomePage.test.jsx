import { render, screen, fireEvent } from '@testing-library/react'
import HomePage from '../../../main/pages/HomePage'
import { useNavigate } from 'react-router-dom'

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: vi.fn(),
    }
})

describe('HomePage', () => {
    test('allows user to search for a city and navigates with correct state', () => {
        const mockNavigate = vi.fn()
        useNavigate.mockReturnValue(mockNavigate)

        render(<HomePage />)

        const input = screen.getByPlaceholderText('Wpisz nazwę miasta...')
        const button = screen.getByRole('button', { name: 'Szukaj' })

        fireEvent.change(input, { target: { value: 'Warszawa' } })
        fireEvent.click(button)

        expect(mockNavigate).toHaveBeenCalledWith('/apartments', {
            state: {
                searchFilter: { miasto: 'Warszawa' }
            }
        })
    })
})

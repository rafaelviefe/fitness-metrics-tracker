import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Fitness Metrics Tracker')
  })

  it('shows system status as online', () => {
    render(<Home />)
    const status = screen.getByText(/System Status:/i)
    expect(status).toHaveTextContent('Online')
  })
})
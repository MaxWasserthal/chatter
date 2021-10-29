import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import Register from '../pages/register'

const Providers = ({ children }:any) => {

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

jest.mock('axios')

describe('Register', () => {

  it("renders empty inputfields", () => {
    const screen = render(<Register />, { wrapper: Providers })
    const inputs = screen.container.querySelectorAll('input')
    inputs.forEach(i => {
      expect(i.value).toBe("")
    })
  })

  it("renders 1 submit buttons that throws an error when submit values are empty", () => {
    const screen = render(<Register />, { wrapper: Providers })
    const submitButton = screen.container.querySelector('button[type="submit"]')
    act(() => {
      fireEvent.click(submitButton!)
    })
    expect(screen.container.querySelectorAll('#chakra-toast-manager-bottom')).toBeDefined()
  })
})
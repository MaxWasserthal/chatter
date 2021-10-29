import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { act } from 'react-dom/test-utils';
import { QueryClient, QueryClientProvider } from 'react-query';

import Login from '../pages/login'

const Providers = ({ children }:any) => {

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

jest.mock("next/link", () => {
  return ({children}:any) => {
    return children;
  }
});

describe('Login', () => {

  it("renders empty inputfields", () => {
    const screen = render(<Login />, { wrapper: Providers })
    const inputs = screen.container.querySelectorAll('input')
    inputs.forEach(i => {
      expect(i.value).toBe("")
    })
  })

  it("renders 1 submit buttons that throws an error when submit values are empty", () => {
    const screen = render(<Login />, { wrapper: Providers })
    const submitButton = screen.container.querySelector('button[type="submit"]')
    act(() => {
      fireEvent.click(submitButton!)
    })
    expect(screen.container.querySelectorAll('#chakra-toast-manager-bottom')).toBeDefined()
  })

  it("renders button for redirecting", async () => {
    const screen = render(<Login />, { wrapper: Providers })
    expect(screen.container.querySelectorAll('button[type="button"]').length).toEqual(1)
  })

  it('redirects to register page after click', async () => {
    const screen = render(<Login />, { wrapper: Providers })
    const registerButton = screen.container.querySelector('button[id="register"]')
    act(() => {
      fireEvent.click(registerButton as Element)
    })
    expect(screen.container.querySelector("button[value='Register']")).toBeDefined()
  });
})
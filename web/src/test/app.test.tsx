import { render } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query';

import Home from '../pages/index'

const Providers = ({ children }:any) => {

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
};

describe('App', () => {
  it("renders without crashing", () => {
    render(<Home/>, { wrapper: Providers })
  });
})
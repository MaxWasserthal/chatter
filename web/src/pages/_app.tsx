import { ChakraProvider,ColorModeScript } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import theme from 'theme';
import { QueryClient, QueryClientProvider } from "react-query";

function MyApp({ Component, pageProps }: AppProps):any {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp;
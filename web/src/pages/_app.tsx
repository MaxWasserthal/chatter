import { ChakraProvider,ColorModeScript } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { socket, SocketContext } from '../context/socket';
import theme from 'theme';
import { QueryClient, QueryClientProvider } from "react-query";

function MyApp({ Component, pageProps }: AppProps):any {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SocketContext.Provider value={socket}>
          <Component {...pageProps} />
          </SocketContext.Provider>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default MyApp;
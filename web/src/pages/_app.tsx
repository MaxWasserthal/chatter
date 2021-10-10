import { ChakraProvider,ColorModeScript } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { socket, SocketContext } from '../context/socket';
import theme from 'theme';

function MyApp({ Component, pageProps }: AppProps):any {
  return (
    <ChakraProvider resetCSS>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SocketContext.Provider value={socket}>
        <Component {...pageProps} />
        </SocketContext.Provider>
     </ChakraProvider>
  )
}

export default MyApp;
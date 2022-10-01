import { useEffect } from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;

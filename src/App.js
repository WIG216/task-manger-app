import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import '@fontsource-variable/public-sans';
import theme from './theme/theme';
import Login from './pages/auth/Login';
import { Route, Routes } from 'react-router-dom';
import Register from 'pages/auth/Register';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/auth/login" element={<Login/>} />
        <Route path="/auth/register" element={<Register/>} />
      </Routes>
      {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
    </ChakraProvider>
  );
}

export default App;

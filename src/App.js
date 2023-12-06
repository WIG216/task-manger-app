import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource-variable/public-sans';
import theme from './theme/theme';
import Login from './pages/auth/Login';
import { Route, Routes } from 'react-router-dom';
import Register from 'pages/auth/Register';
import Profile from 'pages/admin/Profile';
import Project from 'pages/admin/Project';
import DashboardLayout from 'layouts/admin/DashboardLayout';
import useAuth from 'hook/useAuth';

function App() {
  const [user, loading] = useAuth();

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/auth/login" element={<Login/>} />
        <Route path="/auth/register" element={<Register/>} />
        
        <Route path="/" element={<DashboardLayout loading={loading} user={user}><Profile/></DashboardLayout>} />
        <Route path="/project/:projectId" element={<DashboardLayout loading={loading} user={user}><Project/></DashboardLayout>} />
        
      </Routes>
    </ChakraProvider>
  );
}

export default App;

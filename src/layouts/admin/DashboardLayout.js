import {
  Box,
  Flex,
  Spacer,
  Spinner,
} from '@chakra-ui/react';
import { signOut } from '@firebase/auth';
import { auth } from 'config/firebase-config';
import Button from 'components/Base/Button';
import { NavLink } from 'react-router-dom';

const DashboardLayout = ({ loading, user, children }) => {
  if (loading) {
    return (
      <Flex minH="100vh" bgColor="blue.50" pt="20" px="4" direction="column">
        <Spinner mx="auto" mt="24" />
      </Flex>
    );
  }

  return (
    <Box minH="full">
      <Flex
        as="nav"
        padding="2"
        shadow="sm"
        bgColor="white"
        alignItems="center"
        px="2rem"
        mb="2rem"
      >
        <NavLink paddingX="4" paddingY="3" rounded="lg" mr="4" to="/">
          My Projects
        </NavLink>
        <Spacer />

        {loading ? (
          <Flex
            minH="100vh"
            bgColor="blue.50"
            pt="20"
            px="4"
            direction="column"
          >
            <Spinner mx="auto" mt="24" />
          </Flex>
        ) : user ? (
          <Box>
            <Button onClick={() => signOut(auth)}>Logout</Button>
          </Box>
        ) : (
          <Box>
            <NavLink to="/auth/login">Log in</NavLink>
          </Box>
        )}
      </Flex>
      {children}
    </Box>
  );
};

export default DashboardLayout;

import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';

// Assets
import { FcGoogle } from 'react-icons/fc';
import { NavLink, Navigate } from 'react-router-dom';
import { LoginIllustration } from 'assets';
import Input from 'components/Base/Input';
import PasswordField from 'components/Base/PasswordField';
import Button from 'components/Base/Button';
import { useFormik } from 'formik';
import { loginValidator } from 'utils/validator';

//Firebase import
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from 'config/firebase-config';
import {  useReducer } from 'react';
import useAuth from 'hook/useAuth';



function Login() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const googleBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.200');
  const googleText = useColorModeValue('navy.700', 'white');
  const googleHover = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.300' }
  );
  const googleActive = useColorModeValue(
    { bg: 'secondaryGray.300' },
    { bg: 'whiteAlpha.200' }
  );

  const reducer = (prevState, action) => ({ ...prevState, ...action });
  const [state, dispatch] = useReducer(reducer, { loading: false });
  const [user] = useAuth();


  const initialValues = {
    email: '',
    password: '',
  };

  const submitForm = async values => {
    const { email, password } = values;
    dispatch({ loading: true });

    await signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        dispatch({ loading: false, user: user });
      })
      .catch( error => {
        dispatch({ error: error.message });
      });

    dispatch({ loading: false });
  };

  const formik = useFormik({
    initialValues,
    validationSchema: loginValidator,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: submitForm,
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <DefaultAuth
      illustrationBackground={LoginIllustration}
      image={LoginIllustration}
    >
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <Button
            fontSize="sm"
            me="0px"
            mb="26px"
            py="15px"
            h="50px"
            borderRadius="16px"
            variant="outline"
            bg={googleBg}
            color={googleText}
            fontWeight="500"
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}
          >
            <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
            Sign in with Google
          </Button>
          <Flex align="center" mb="25px">
            <HSeparator />
            <Text color="gray.400" mx="14px">
              or
            </Text>
            <HSeparator />
          </Flex>
          <FormControl>
            <VStack rowGap="24px">
              <Input
                label="Email"
                name="email"
                required
                type="email"
                fontWeight="500"
                value={formik.values.email}
                error={formik.errors.email}
                onChange={formik.handleChange}
                placeholder="mail@task.com"
              />
              <PasswordField
                label="Password"
                name="password"
                required
                placeholder="Min. 6 characters"
                fontWeight="500"
                value={formik.values.password}
                error={formik.errors.password}
                onChange={formik.handleChange}
              />
            </VStack>

            <Flex justifyContent="space-between" align="center" my="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                  Keep me logged in
                </FormLabel>
              </FormControl>
              <NavLink to="/auth/forgot-password">
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  w="124px"
                  fontWeight="500"
                >
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              loading={state.loading}
              onClick={formik.submitForm}
            >
              Sign In
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Not registered yet?
              <NavLink to="/auth/register">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Create an Account
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default Login;

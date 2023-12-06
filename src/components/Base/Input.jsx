import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  useColorModeValue,
  Text,
  FormHelperText,
  Box,
  InputLeftElement,
  InputGroup,
  Icon,
} from '@chakra-ui/react';
import NumberInput from './NumberInput';

export default function Input({
  label,
  hideLabel,
  required,
  placeholder,
  name,
  error,
  leftIcon,
  rightIcon,
  type = '',
  ...rest
}) {
  const textColor = useColorModeValue('navy.700', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColorSecondary = 'gray.400';

  return (
    <FormControl>
      {!hideLabel && (
        <FormLabel display="flex" color={textColor} fontSize='sm'
        fontWeight='500'>
          {label} {required && <Text color={brandStars}>*</Text>}
        </FormLabel>
      )}
      <Box>
        {type === 'number' ? (
          <NumberInput
            isRequired={required}
            name={name}
            hideLabel
            placeholder={placeholder}
            {...rest}
          />
        ) : (
          <InputGroup>
            {leftIcon && (
              <InputLeftElement display="flex" alignItems="center">
                <Icon
                  fontSize={'xl'}
                  color={textColorSecondary}
                  as={leftIcon}
                />
              </InputLeftElement>
            )}
            <ChakraInput
              isRequired={required}
              variant="auth"
              name={name}
              placeholder={placeholder}
              type={type}
              isInvalid={true}
              {...rest}
            />
            {rightIcon && (
              <InputLeftElement display="flex" alignItems="center">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={rightIcon}
                />
              </InputLeftElement>
            )}
          </InputGroup>
        )}
        {error && <FormHelperText color="red.500">{error}</FormHelperText>}
      </Box>
    </FormControl>
  );
}

import {
  FormControl,
  FormLabel,
  useColorModeValue,
  Text,
  FormHelperText,
  Box,
  Select as ChakraSelect,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

export default function Select({
  label,
  hideLabel,
  required,
  placeholder,
  error,
  options = [],
  loading,
  disabled,
  ...rest
}) {
  const textColor = useColorModeValue("navy.700", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  return (
    <FormControl>
      {!hideLabel && (
        <FormLabel display="flex" color={textColor}>
          {label} {required && <Text color={brandStars}>*</Text>}
        </FormLabel>
      )}
      <Box pos="relative">
        <ChakraSelect
          placeholder={placeholder}
          isDisabled={loading || disabled}
          variant="auth"
          {...rest}
        >
          {options.map(opt => (
            <option value={opt.value}>{opt.label}</option>
          ))}
        </ChakraSelect>
        {error && <FormHelperText color="red.500">{error}</FormHelperText>}

        {loading && (
          <Box
            pos="absolute"
            right="10px"
            top="50%"
            transform="translateY(-40%)"
            bg="white"
          >
            <Spinner size="sm" />
          </Box>
        )}
      </Box>
    </FormControl>
  );
}

import {
  FormControl,
  FormLabel,
  NumberInput as ChakraNumberInput,
  useColorModeValue,
  Text,
  FormHelperText,
  Box,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  NumberInputField,
} from "@chakra-ui/react";
import React from "react";

export default function NumberInput({
  label,
  hideLabel,
  required,
  placeholder,
  name,
  error,
  type = "",
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
      <Box>
        <ChakraNumberInput
          isRequired={required}
          name={name}
          placeholder={placeholder}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </ChakraNumberInput>

        {error && <FormHelperText color="red.500">{error}</FormHelperText>}
      </Box>
    </FormControl>
  );
}

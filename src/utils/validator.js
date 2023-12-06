import * as yup from "yup";

const registrationValidator = yup.object({
  email: yup.string().email().required("Email field is mandatory"),
  password: yup
    .string()
    .min(6, "Password must be at least 5 characters.")
    .matches(/^(\S+$)/g, "This field can't contain blankspaces")
    .required("Password must be provided"),

  confirmPassword: yup
    .string()
    .min(6, "Password must be at least 5 characters.")
    .matches(/^(\S+$)/g, "This field can't contain blankspaces")
    .required("Confirm password must be provided")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const loginValidator = yup.object({
  email: yup.string().email().required("Email field is mandatory"),
  password: yup
    .string()
    .min(6, "Password should be atleast 6 characters")
    .required("Password field is mandatory"),
});


export { loginValidator, registrationValidator};

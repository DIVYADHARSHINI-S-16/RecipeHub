export const validateRegisterInput = ({ name, email, password }) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Please provide a valid email";
  }

  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginInput = ({ email, password }) => {
  const errors = {};

  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

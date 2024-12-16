const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Username is required");
  } else if (firstName.length > 50 || lastName.length > 50) {
    throw new Error("Username can't have more than 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = {
  validateSignup,
};

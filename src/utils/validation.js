const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name required");
  } else if (firstName.length > 50 || lastName.length > 50) {
    throw new Error("Name shouldn't have more than 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "skills",
    "gender",
    "photoUrl",
    "about",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isEditAllowed;
};

module.exports = {
  validateSignup,
  validateEditProfileData,
};

const adminAuth = function (req, res, next) {
  const token = 12466;
  const isAdminAuthorized = token === 12466;
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = function (req, res, next) {
  const token = 96361;
  const isUserAuthorized = token === 9636;
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized request found");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth
};

const adminAuth = function (req, res, next) {
  const token = 12466;
  if (token !== 12466) {
    res.status(401).send("Unauthorized request found");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
};

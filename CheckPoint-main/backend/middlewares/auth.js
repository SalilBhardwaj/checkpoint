const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  if (req.user) {
    return next();
  }
  const token = req.cookies.token;
  if (!token) {
    console.log("no token");
    return logoutUser(req, res);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    console.log("verified");
    next();
  } catch (error) {
    return logoutUser(req, res);
  }
};

const logoutUser = (req, res) => {
  res.status(401).json({ message: "Unauthorized. Please log in again." });
};

module.exports = verifyUser;

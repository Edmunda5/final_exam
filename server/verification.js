const jwt = require("jsonwebtoken");

// Middleware to verify if the user is logged in by token provided in the cookies
const verification = {
  verify: (req, res, next) => {
    const token = req.cookies.token;
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } catch (error) {
      res.clearCookie("token");
      res.redirect("/login");
    }
  },
  signInToken: (userId) => {
    return jwt.sign(
        { username: userId},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  },
  checkVerification: (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(401);
          res.send({ message: "unauthorized"});
        } else {
          res.status(200);
          next();
        }
      });
    } else {
      res.status(401);
      res.send({ message: "unauthorized"});
    }
  },
};

module.exports = verification;

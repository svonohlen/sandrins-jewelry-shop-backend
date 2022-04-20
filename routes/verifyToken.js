const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token; //token send in header (bearer)
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // since in header it is written "bearer token" you need to split it into array and then select second item (index 1) which is token

    jwt.verify(token, process.env.JWT_SK, (err, user) => {
      if (err) {
        res.status(403).json("token is not valid"); //can be expired or wrong token
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("you are not authenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed to conduct this action");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed to conduct this action");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};

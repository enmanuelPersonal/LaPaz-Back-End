const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const LaPaz_auth_token =
    req.headers.LaPaz_auth_token || req.signedCookies.LaPaz_auth_token;

  try {
    const authEntity = jwt.verify(LaPaz_auth_token, process.env.JWT_SECRET);
    Object.assign(req, { authEntity });

    next();
  } catch (error) {
    return res.status(401).send({
      message: "The token is invalid or has not been provided.",
    });
  }
};

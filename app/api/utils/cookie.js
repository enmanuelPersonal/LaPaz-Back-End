const jwt = require('jsonwebtoken');

module.exports = ({ tipoUsuario, idEntidad, idUsuario, nombre, permisos }) => {
  const { JWT_SECRET } = process.env;
  const cookie = jwt.sign(
    {
      tipoUsuario,
      idEntidad,
      idUsuario,
      nombre,
      permisos,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  const cookieExpirationMs = 604800000;
  const cookieExpirationDate = new Date(
    Date.now() + cookieExpirationMs
  ).toUTCString();
  const cookieConfig = {
    expires: cookieExpirationDate,
    httpOnly: true,
    maxAge: cookieExpirationMs,
    signed: true,
  };

  return { cookie, cookieConfig };
};

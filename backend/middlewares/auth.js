const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorizedError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

// ошибки 500 больше нет, но при открытии профиля выдает 401,
// якобы не авторизован профиль, поэтому ничего сделать нельзя
// просидела весь день, не смогла понять в чем проблема,
// если поможете или подскажите в чем может быть ошибка, буду очень благодарна

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

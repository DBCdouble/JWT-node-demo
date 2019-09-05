const api = require('./api');
const { getToken } = require('../libs/jwt');

const tokenMiddleWare = (req, res, next) => {
  console.log('这里是token中间件')
  try {
    req.user = getToken(req);
  } finally {
    next();
  }
}

module.exports = (app) => {
  app.use('/api', tokenMiddleWare, api)
};
const jwt = require('jsonwebtoken');
const JWT_TOKEN_NAME = 'USER-SESSION-TOKEN';
const JWT_EXPIRATION = 60 * 60 * 24 * 7;
const JWT_SECRET = 'DBCDouble'

//校验token
const verify = (data, secret = JWT_SECRET) => {
  try {
    return jwt.verify(data, secret)
  } catch (error) {
    throw new Error('用户信息校验不通过')
  }
}

//生成签名
const sign = (data) => {
  try {
    return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
  } catch (error) {
    throw new Error('加密失败')
  }
}

//获取token
const getToken = (req) => {
  let data = {}
  if (req.cookies[JWT_TOKEN_NAME]) {
    try {
      data = verify(req.cookies[JWT_TOKEN_NAME])
    } catch (error) {
      throw new Error('token有误')
    }
  }
  return data
}

//设置token
const setToken = (data, res) => {
  const token = sign(data);
  res.cookie(JWT_TOKEN_NAME, token, {
    maxAge: 1000 * JWT_EXPIRATION,
    httpOnly: true
  })
}

//清除cookie
const cleanToken = (res) => {
  res.clearCookie(JWT_TOKEN_NAME)
}
module.exports = {
  getToken,
  setToken,
  cleanToken
}
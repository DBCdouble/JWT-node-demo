const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();
const { setToken, cleanToken } = require('../../libs/jwt');
let decryptedPassword = '';

router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const private_key = fs.readFileSync(path.resolve(__dirname, '../../libs/private_key.txt'));
    const decrypted = crypto.privateDecrypt({
      key: private_key,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    }, Buffer.from(password, 'base64'));
    decryptedPassword = decrypted; //拿到解密的密码之后，去数据库查询，自行实现登录接口，这里不做演示
    setToken({
      username
    }, res)
    res.json({
      code: 0,
      data: {
        username,
      },
      msg: '登录成功'
    })
  } catch (error) {
    next(error)
  } 
})

router.get('/logout', (req, res, next) => {
  try {
    cleanToken(res)
    res.json({
      error: false,
      msg: '用户已退出登录' 
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router;
![alt](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568125319934&di=b1f65e3fcdfcf91d587ffe2b5ecf5810&imgtype=0&src=http%3A%2F%2Fimage.blog.zhouchenxi.cn%2F2017%2F03%2F20170308185903_17073.jpg)
# JWT-node-demo
基于JWT(jsonwebtoken)和node实现用户登录授权控制

## 技术栈

`React Hooks + ant design + Webpack + express（后端） + jsencrypt（加密） + crypto（解密） + openSSL（生成公私钥）`

开启项目：`npm start`

## 前言

目前主流的用户认证方法有基于token和基于session两种方式。

## 基于session

1、用户输入其登录信息

2、服务器验证用户信息，创建一个session并将它存储在数据库中

3、服务器为用户创建一个sessionid，并将具有sessionid的cookie保存在浏览器中

4、后续每次请求都带上具有sessionid的cookie，服务器根据数据库中存储的cookie验证，有效就接受请求

5、一旦用户注销应用，会话将在客户端和服务端都被销毁

## 基于token的用户认证（JWT）

1、用户输入其登录信息

2、服务器验证用户信息，并返回已签名的token

3、token存储在浏览器，例如cookie中

4、后续每次请求都带上cookie中的token

5、服务器解码JWT，如果令牌有效，则接受请求

6、一旦用户注销应用，cookie只在浏览器被销毁，服务器就不保存任何 session 数据了，也就是说，服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。

## 非对称加密算法和对称加密算法

浏览器向服务器发送用户名和密码时，需要对密码进行加密，保证密码不被泄露。什么是算法，你就可以理解成为是一种规则吧，这种规则可以将信息从一种形式转变成另一种形式。

### 对称加密算法

对称加密算法是应用较早的加密算法，技术成熟。在对称加密算法中，数据发送方将明文（原始数据）和加密密钥一起经过特殊加密算法处理后，使其变成复杂的加密密文发送出去。接收方收到密文后，若想解读原文，则需要使用加密用过的密钥及相同算法的逆算法对密文进行解密，才能使其恢复成可读明文。在对称加密算法中，使用的密钥只有一个，发收信双方都使用这个密钥对数据进行加密和解密，这就要求解密方事先必须知道加密密钥。

`明文 <-> 密钥 <-> 密文`

### 非对称加密算法

公开密钥加密，也称为非对称加密，一种密码学算法类型，在这种密码学方法中，需要一对密钥，一个是私人密钥（私钥），另一个则是公开密钥（公钥）。某用户密钥加密后所得的信息，只能用该用户的解密密钥才能解密。如果知道了其中一个，并不能计算出另外一个。因此如果公开了一对密钥中的一个，并不会危害到另外一个的秘密性质。称公开的密钥为公钥；不公开的密钥为私钥。

`明文 + 公钥 -> 密文 -> 密文 + 私钥 = 明文`

因此，非对称加密是一种比对称加密更加优秀的加密算法，当然算法有利有弊，对称加密速度快但是安全性相对于非对称加密来说低，为什么呢，你想啊，要想使用对称加密，那么分享信息的各个个体之间都需要分享这个密钥，比如你们1000个人之间都使用同一个密钥进行密文传输，只要其中一个人密钥被盗窃了，那么整体加密的信息将都被破解了。

## 解决方案

项目中在用户登录时需要进行用户名和密码加密,这里选用了RSA非对称加密的方式.

公钥私钥:`OpenSSL`的公钥私钥(Node crypto模块限制)
前端: jsencrypt库加密
后端: Node crypto模块

## 使用OpenSSL生成公钥私钥

### 打开Terminal--cd 到指定文件夹MyCert

`mkdir myKey && cd myKey`

### 终端输入openssl

`openssl`

### 生成私钥

`genrsa -out rsa_private_key.pem 2048`

### 把RSA私钥转换成PKCS8格式

`pkcs8 -topk8 –nocrypt -inform PEM -in rsa_private_key.pem -outform PEM`

### 生成公钥

`rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem`

## 前端使用jsencrypt库加密

```
// client/pages/Login.jsx

const handleSubmit = e => {
  e.preventDefault()
  form.validateFields((err, values) => {
    if (!err) {
      const { username, password } = values;
      console.log(values)
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(PUB_KEY);
      const params = {
        username,
        password: encrypt.encrypt(password)
      }
      axios.post(`/api/user/login`, params)
      .then(({ data }) => {
        if (data.code === 0) {
          message.success('登录成功')
          history.push({ pathname: '/home', state: { username } })
        }
      })
    }
  })
}

```

以上代码做的就是 用户密码 + 公钥（盐） = 密文 的过程（公钥用来加密，私钥用来解密）PUB_KEY就是在第一步openssl生成的公钥文件myCert/rsa_public_key.pem文件，直接复制拷贝过来用

## 使用Node的crypto模块解密

```
// server/routes/api/user.js

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

```

**注意：**

(1) fs.readFileSync()来读取私钥文件

(2) 使用用户的信息（除了密码）来生成token，密码只用来向数据库或后端微服务查询用户信息

## JWT（jsonwebtoken）生成令牌token

```
// server/libs/jwt.js

const jwt = require('jsonwebtoken');
const JWT_TOKEN_NAME = 'USER-SESSION-TOKEN';
const JWT_EXPIRATION = 60 * 60 * 24 * 7;
const JWT_SECRET = 'DBCDouble'

//生成签名
const sign = (data) => {
  try {
    return jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
  } catch (error) {
    throw new Error('加密失败')
  }
}

//设置token
const setToken = (data, res) => {
  const token = sign(data);
  res.cookie(JWT_TOKEN_NAME, token, {
    maxAge: 1000 * JWT_EXPIRATION,
    httpOnly: true
  })
}

```
**注意：**  

JWT_SECRET可以是一个自定义的字符串用来给加密算法“加盐”用,这样之后我们就成功生成了token并保存在浏览器的cookie中了

## 封装tokenMiddleWare来校验token

每当浏览器发起请求到node层的路由中间件处理业务之前，都需要先对请求携带的token做校验，通过则执行对应的业务逻辑

```
// server/routes/index.js

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

```

```
// server/libs/jwt.js

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


//校验token
const verify = (data, secret = JWT_SECRET) => {
  try {
    return jwt.verify(data, secret)
  } catch (error) {
    throw new Error('用户信息校验不通过')
  }
}

//清除cookie
const cleanToken = (res) => {
  res.clearCookie(JWT_TOKEN_NAME)
}

```
`附：cleanToken方法用来做退出登录操作，清除浏览器token令牌`

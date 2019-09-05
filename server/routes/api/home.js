const express = require('express')
// const proxy = require('http-proxy-middleware')
const router = express.Router()
const mockJson = [{
  id: 1,
  imgpath: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=03bffbb568380cd7e61ea5eb997fca09/72f082025aafa40ff83acad8a664034f78f01932.jpg'
},{
  id: 2,
  imgpath: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=03bffbb568380cd7e61ea5eb997fca09/72f082025aafa40ff83acad8a664034f78f01932.jpg'
},{
  id: 3,
  imgpath: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=03bffbb568380cd7e61ea5eb997fca09/72f082025aafa40ff83acad8a664034f78f01932.jpg'
},{
  id: 4,
  imgpath: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=03bffbb568380cd7e61ea5eb997fca09/72f082025aafa40ff83acad8a664034f78f01932.jpg'
},{
  id: 5,
  imgpath: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=03bffbb568380cd7e61ea5eb997fca09/72f082025aafa40ff83acad8a664034f78f01932.jpg'
},{
  id: 6,
  imgpath: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=03bffbb568380cd7e61ea5eb997fca09/72f082025aafa40ff83acad8a664034f78f01932.jpg'
},{
  id: 7,
  imgpath: 'https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=03bffbb568380cd7e61ea5eb997fca09/72f082025aafa40ff83acad8a664034f78f01932.jpg'
}]
// const proxyOptions = {
//   target: 'http://baidu.com',
//   changeOrigin: true,
//   ws: true,
//   pathRewrite: {
//     '/api/home/goodsList': '/top/goodsList'
//   }
// }
// const convertProxy = proxy(proxyOptions)
router.get('/goodsList', (req, res, next) => {
  try {
    res.json({
      code: 0,
      data: mockJson,
      success: true
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
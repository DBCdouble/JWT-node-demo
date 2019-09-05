// import express from 'express';
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const history = require('connect-history-api-fallback');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const webpackConfig = require('../webpack.config');
const router = require('./routes');
const limit = '50mb';


app.use('/', express.static('dist'));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ limit, extended: true }));

app.use(bodyParser.json({ limit }));

app.use(history());

const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
      colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));

router(app);

app.listen(3000, () => {
  console.log('server is running at localhost:3000');
})
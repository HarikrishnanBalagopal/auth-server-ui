const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/auth-server',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
    })
  );
};
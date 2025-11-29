const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware({
      pathFilter: '/api',  // Only proxy requests starting with /api
      target: 'http://127.0.0.1:5000', // Use 127.0.0.1 to prevent IPv6 issues
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware({
      pathFilter: '/socket.io',
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
      ws: true, // This enables WebSocket support
    })
  );
};

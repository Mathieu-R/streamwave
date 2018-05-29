const http = require('http');
const path = require('path');
const fs = require('fs');
const serveStatic = require('serve-static');
const compression = require('compression');
const express = require('express');
const app = express();

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const staticPath = './static'
const swPath = './service-worker.js';

app.use(removeHash);
app.use(validator());
app.use(compression());
app.use('/static', serveStatic(staticPath, {
  maxAge: production ? (365 * 24 * 60 * 60 * 1000) : 0
}));

app.use('/sw.js', require('./apps/sw-handler'));
app.use('/', require('./apps/views-handler'));

http.createServer(app).listen(port, () => {
  console.log(`Portfolio running on http://localhost:${port}`);
});

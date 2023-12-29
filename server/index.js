const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const serve = require('koa-static');
const dataRoutes = require('./src/routes/dataRoutes.js');
const tagRoutes = require('./src/routes/tagRoutes.js');
const path = require('path');

const app = new Koa();
app.use(cors());
app.use(koaBody());
app.use(serve(path.resolve(__dirname, '../client/build')));

app.use(dataRoutes.routes()).use(dataRoutes.allowedMethods());
app.use(tagRoutes.routes()).use(tagRoutes.allowedMethods());

let PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
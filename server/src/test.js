const Koa = require("koa");
const { koaBody } = require("koa-body");

const app = new Koa();

app.use(koaBody());
app.use((ctx, next) => {
  ctx.request.body = { custom: 'This is a custom request body' };
  return next();
});
app.use((ctx) => {
  ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;
});

app.listen(3000);

const buf = new Buffer("武abc12");
console.log(buf);

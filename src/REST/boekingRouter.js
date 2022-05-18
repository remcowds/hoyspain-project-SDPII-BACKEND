const Router = require('@koa/router');
const boekingService = require('../service/boekingService');
const {
  requireAuthentication
} = require('../core/auth');

const getBoekingen = async (ctx) => {
  ctx.body = await boekingService.getBoekingen(ctx.query);
};

const getBoekingenByWoning = async (ctx) => {
  ctx.body = await boekingService.getBoekingenByWoning(ctx.params.id);
}

const createBoeking = async (ctx) => {
  ctx.body = await boekingService.createBoeking(ctx.request.body)
}

module.exports = function installBoekingRouter(superRouter) {
  const router = new Router({
    prefix: '/boeking',
  });

  //GET-request
  router.get('/', getBoekingen);
  router.get('/woning/:id', getBoekingenByWoning);

  //POST-request
  router.post('/',requireAuthentication, createBoeking);

  superRouter.use(router.routes()).use(router.allowedMethods());
}
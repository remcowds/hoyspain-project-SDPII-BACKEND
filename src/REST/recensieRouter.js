const Router = require('@koa/router');
const recensieService = require('../service/recensieService');
const {
  requireAuthentication
} = require('../core/auth');

const getBeoordelingenByWoning = async (ctx) => {
  ctx.body = await recensieService.getBeoordelingenByWoning(ctx.params.id);
};

const createBeoordeling = async (ctx) => {
  ctx.body = await recensieService.createBeoordeling(ctx.request.body)
}

module.exports = function installRecensieRouter(superRouter) {
  const router = new Router({
    prefix: '/recensie',
  });

  //GET-request with woningid
  router.get('/:id', getBeoordelingenByWoning);
  router.post('/',requireAuthentication, createBeoordeling);

  superRouter.use(router.routes()).use(router.allowedMethods());
}
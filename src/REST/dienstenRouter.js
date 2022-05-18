const Router = require('@koa/router');
const dienstenService = require('../service/dienstenService');

const getDiensten = async (ctx) => {
  const diensten = await dienstenService.getDiensten();
  ctx.body = diensten;
};

// const removeDienst = async (ctx) => {
//   ctx.body = await dienstenService.deleteById(ctx.params.id);
//   ctx.status = 204;
// };



module.exports = function installDienstenRouter(superRouter) {
  const router = new Router({
    prefix: '/diensten',
  });

  //GET-request 
  router.get('/', getDiensten);

  //DELETE-request
  //router.delete('/:id', requireAuthentication, requireAdminOrOwner, removeDienst);

  superRouter.use(router.routes()).use(router.allowedMethods());
}
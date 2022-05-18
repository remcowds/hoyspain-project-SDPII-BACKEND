const Router = require('@koa/router');
const regioService = require('../service/regioService');
const Role = require('../core/roles');
const {
  requireAuthentication,
  makeRequireRole
} = require('../core/auth');

const getAllRegios = async (ctx) => {
  const regios = await regioService.getAll();
  ctx.body = regios;
};

const getRegioById = async (ctx) => {
  ctx.body = await regioService.getById(ctx.params.id);
};

const updateRegio = async (ctx) => {
  ctx.body = await regioService.updateById(ctx.params.id, ctx.request.body);
};

const removeRegio = async (ctx) => {
  ctx.body = await regioService.deleteById(ctx.params.id);
  ctx.status = 204;
};

const requireAdminOrOwner = makeRequireRole([Role.ADMIN, Role.OWNER]);

module.exports = function installRegioRouter(superRouter) {
  const router = new Router({
    prefix: '/regio',
  });

  //GET-request 
  router.get('/', getAllRegios);

  //GET-request with id
  router.get('/:id', getRegioById);

  //PUT-request (with id)
  router.put('/:id', requireAuthentication, requireAdminOrOwner,  updateRegio);

  //DELETE-request
  router.delete('/:id', requireAuthentication, requireAdminOrOwner, removeRegio);

  superRouter.use(router.routes()).use(router.allowedMethods());
}
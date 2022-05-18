const Router = require('@koa/router');
const favorietenService = require('../service/favorietenService');
const {
  requireAuthentication
} = require('../core/auth');

const getFavorieten = async (ctx) => {
  ctx.body = await favorietenService.getFavorieten(ctx.query);
};


const getFavorietenByUser = async (ctx) => {
  ctx.body = await favorietenService.getFavorietenByUser(ctx.params.id);
};

const addFavorieten = async (ctx) => {
  ctx.body = await favorietenService.addFavorieten(ctx.request.body)
}

const removeFavoriet = async (ctx) => {
    ctx.body = await favorietenService.removeFavoriet(ctx.params.id);
    ctx.status = 204;
  };

module.exports = function installRecensieRouter(superRouter) {
  const router = new Router({
    prefix: '/favorieten',
  });

  //GET-request with woningid
  router.get('/', getFavorieten)
  router.get('/:id', getFavorietenByUser);
  router.post('/',requireAuthentication, addFavorieten);
  router.del('/:id', requireAuthentication, removeFavoriet )

  superRouter.use(router.routes()).use(router.allowedMethods());
}
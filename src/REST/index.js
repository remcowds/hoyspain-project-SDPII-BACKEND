const Router = require('@koa/router');
const installWoningRouter = require('./woningRouter');
const installUsersRoutes = require('./userRouter');
const installRegioRoutes = require('./regioRouter');
const installRecensieRouter = require('./recensieRouter');
const installBedrijfRouter = require('./bedrijfRouter');
const installBoekingRouter = require('./boekingRouter')
const installFavorietenRouter = require('./favorietenRouter')
const installDienstenRouter = require('./dienstenRouter')

// const {installImagesRouter} = require('./imagesRouter')

module.exports = function installRest(app) {
  const router = new Router({
    prefix: '/api',
  });

  installWoningRouter(router);
  installWoningRouter(router);
  // installImagesRouter(router);
  installUsersRoutes(router);
  installRegioRoutes(router);
  installRecensieRouter(router);
  installBedrijfRouter(router);
  installBoekingRouter(router);
  installFavorietenRouter(router);
  installDienstenRouter(router);


  app.use(router.routes()).use(router.allowedMethods());
}
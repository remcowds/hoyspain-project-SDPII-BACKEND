const Joi = require('joi');
const Router = require('@koa/router');
const userService = require('../service/userService');
const Role = require('../core/roles');
const {
  requireAuthentication,
  makeRequireRole
} = require('../core/auth');

const validate = require('./_validation');


const login = async (ctx) => {
  const {
    emailAdres,
    wachtwoord
  } = ctx.request.body;
  const session = await userService.login(emailAdres, wachtwoord);
  ctx.body = session;
};
login.validationScheme = {
  body: {
    emailAdres: Joi.string().email(),
    wachtwoord: Joi.string(),
  },
};


const register = async (ctx) => {
  const session = await userService.register(ctx.request.body);
  ctx.body = session;
};
register.validationScheme = {
  body: {
    name: Joi.string().max(255),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};


const getAllUsers = async (ctx) => {
  const users = await userService.getAll();
  ctx.body = users;
};
getAllUsers.validationScheme = {
  query: Joi.object({
    limit: Joi.number().integer().positive().max(1000).optional(),
    offset: Joi.number().integer().min(0).optional(),
  }).and('limit', 'offset'),
};


const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};


const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const wijzigRolUser = async (ctx) => {

  const user =await userService.wijzigRechtenById({rol:ctx.request.body.rol, userID:ctx.params.id});
  ctx.body = user;
};

const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  // Public routes
  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', register);
  //router.post('/register', validate(register.validationScheme), register);

  const requireAdminOrOwner = makeRequireRole([Role.ADMIN, Role.OWNER]);
  const requireOwner = makeRequireRole(Role.OWNER);

  // Routes with authentication/autorisation
  router.get('/', requireAuthentication, requireAdminOrOwner, validate(getAllUsers.validationScheme), getAllUsers);

  router.get('/:id', requireAuthentication, getUserById); //validate(getUserById.validationScheme)

  router.put('/:id', requireAuthentication, validate(updateUserById.validationScheme), updateUserById);

  router.put('/rechten/:id', requireAuthentication, requireAdminOrOwner, wijzigRolUser);

  router.delete('/:id', requireAuthentication, requireOwner, validate(deleteUserById.validationScheme), deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
const userService = require('../service/userService');

const requireAuthentication = async (ctx, next) => {
  const {
    authorization,
  } = ctx.headers;

  const {
    authToken,
    ...session
  } = await userService.checkAndParseSession(authorization);

  ctx.state.session = session;
  ctx.state.authToken = authToken;

  return next();
};

const makeRequireRole = (rollen) => async (ctx, next) => {

  const {
    roles=[]
  } = ctx.state.session;

  userService.checkRole(rollen, roles);
  return next();
};

module.exports = {
  requireAuthentication,
  makeRequireRole,
};
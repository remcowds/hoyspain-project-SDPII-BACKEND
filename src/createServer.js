//imports
const Koa = require('koa');
const config = require('config');
const koaCors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const installRest = require('./REST');

const {
  initializeData
} = require('./data/index');
const ServiceError = require('./core/serviceError');

const {
  installFirebase
} = require('./firebase');

const NODE_ENV = config.get('env');

module.exports = async function createServer() {
  //datalaag initialiseren
  await initializeData();

  installFirebase();

  const app = new Koa();

  //CORS configuratie
  const CORS_ORIGINS = config.get('cors.origins');
  const CORS_MAXAGE = config.get('cors.maxAge');

  // CORS definieren
  app.use(
    koaCors({
      origin: (ctx) => {
        if (ctx.request.header.origin) {
          // als de origin in de cors_origins zit (dus matched met de regex) is het in orde
          for (const url of CORS_ORIGINS) {
            if (ctx.request.header.origin.match(url)) {
              return ctx.request.header.origin;
            }
          }
        }
        // anders is het geen correct domein -> de eerste juiste sturen uit de lijst CORS_ORIGINS
        return CORS_ORIGINS[0];
      },

      //aanvraagheaders die het oorspronkelijke domein mag meegeven voor de CORS-aanvraag
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      maxAge: CORS_MAXAGE,
    })
  );

  //bodyparser gebruiken
  app.use(bodyParser());

  //requests loggen
  app.use(async (ctx, next) => {
    console.log(`${ctx.method}-request on ${ctx.url} 👽`)
    const emoji = () => {
      if (ctx.status >= 500) return '💀';
      if (ctx.status >= 400) return '❌';
      if (ctx.status >= 300) return '🚀';
      if (ctx.status >= 200) return '✔️';
      return '⏪';
    };

    try {
      await next();

      console.log(
        `${ctx.method}-request on ${ctx.url} - status: ${
					ctx.status
				} ${emoji()}`
      );
    } catch (error) {
      console.log(
        `${ctx.method}-request on ${ctx.url} - status: ${ctx.status} ❌`
      );
      throw error;
    }
  });

  //errors opvangen
  app.use(async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404) {
        ctx.body = {
          code: 'NOT_FOUND',
          message: `No resource found with url ${ctx.url}`
        }
      }
    } catch (error) {
      const {
        code,
        message,
        details,
        status,
        stack
      } = error;

      let statusCode = status || 500;
      let errorBody = {
        code: code || 'INTERNAL_SERVER_ERROR',
        message,
        details: details || {},
        stack: NODE_ENV !== 'production' ? stack : undefined
      }

      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          statusCode = 404;
        }

        if (error.isValidationFailed) {
          statusCode = 400;
        }

        if (error.isUnauthorized) {
          statusCode = 401;
        }

        if (error.isForbidden) {
          statusCode = 403;
        }
      }
      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  })

  installRest(app);

  return {
    getApp() {
      return app;
    },
    start() {
      return new Promise((resolve) => {
        const port = process.env.PORT || 9000;
        app.listen(port);
        console.log(`Listening on ${port} 👽`);
        resolve();
      });
    },

    async stop() {
      app.removeAllListeners();
      await shutdownData();
    },
  };
};
const Router = require('@koa/router');
const formidable = require('formidable');
const woningService = require('../service/woningService');
const validate = require('./_validation');
const Joi = require('joi');
const {
  requireAuthentication
} = require('../core/auth');
const KoaBody = require('koa-body')({
  multipart: true
})
const multer = require('@koa/multer');
const path = require('path');
const {
  uploadPictures
} = require('./imagesRouter')

let urls = []

const getAllWoningen = async (ctx) => {
  ctx.body = await woningService.getAllWoningen(ctx.query);
};

const getWoningenByUser = async (ctx) => {
  ctx.body = await woningService.getWoningenByUser(ctx.params.id);
}

const getWoningByID = async (ctx) => {
  ctx.body = await woningService.getWoningByID(ctx.params.id);
};

const getWoningenByIDS = async (ctx) => {
  ctx.body = await woningService.getWoningenByIDS(ctx.request.body);
  
};

const updateWoning = async (ctx) => {
  urls = await uploadThePics(ctx);
  ctx.body = await woningService.updateWoning({
    id: ctx.params.id,
    body: ctx.request.body,
    urls
  });
};


async function uploadThePics(ctx) {
  return await uploadPictures(ctx);
}

function fileFilterFunc(req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Please upload only images.', false);
  }
}

//regelt opslag lokaal van de afbeelding
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({
  dest: 'uploads/',
  fileFilter: fileFilterFunc,
  storage: storage,
});


const createWoning = async (ctx) => {
  urls = await uploadThePics(ctx);
  ctx.body = await woningService.createWoning({
    body: ctx.request.body,
    urls
  });
  ctx.status = 201;
};

const removeWoning = async (ctx) => {
  ctx.body = await woningService.removeWoning(ctx.params.id);
  ctx.status = 204;
};

module.exports = function installWoningRouter(superRouter) {
  const router = new Router({
    prefix: '/woning',
  });

  //GET-request 
  router.get('/', getAllWoningen);

  //GET-request with userID
  router.get('/user/:id', getWoningenByUser)

  //GET-request with id

  router.post('/favorieten', getWoningenByIDS)


  router.get('/:id', getWoningByID);

  

  //mss zo de vorige images deleten en de nieuwe dan uploaden, of gwn skip niemand ziet da
  //PUT-request (with id)
  router.put('/:id', requireAuthentication, upload.array('uploadedImages', 10), updateWoning);

  //POST-request

  router.post('/', requireAuthentication, upload.array('uploadedImages', 10), async (ctx) => {
    await createWoning(ctx)
  })


  //DELETE-request
  router.delete('/:id', requireAuthentication, removeWoning);

  superRouter.use(router.routes()).use(router.allowedMethods());
}
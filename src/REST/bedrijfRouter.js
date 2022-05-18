const Router = require('@koa/router');
const bedrijfService = require('../service/bedrijfService');
const Role = require('../core/roles');
const multer = require('@koa/multer');
const path = require('path');
const imagesRepo = require('../service/imagesService');
let url = "";

const {
  requireAuthentication,
  makeRequireRole
} = require('../core/auth');

const {
  uploadPictures
} = require('./imagesRouter')

async function uploadThePic(ctx) {
  try{
    let file = ctx.request.file;
    console.log(file)
    return await imagesRepo.createImageBedrijf(file);
  }
  catch(e)
  {
    console.log(e);
  }
}

//regelt opslag lokaal van de afbeelding
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'bedrijfsUploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({
  dest: 'bedrijfsUploads/',
  fileFilter: fileFilterFunc,
  storage: storage,
});

function fileFilterFunc(req, file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Please upload only images.', false);
  }
}



const c = require('config');

const getBedrijven = async (ctx) => {
  ctx.body = await bedrijfService.getBedrijven(ctx.query);
};
const createBedrijf = async (ctx) => {
  url = await uploadThePic(ctx);
  ctx.body = await bedrijfService.createBedrijf({body:ctx.request.body, url})
};


const removeBedrijf = async (ctx) => {
  ctx.body = await bedrijfService.deleteById(ctx.params.id);
  ctx.status = 204;
};

const requireAdminOrOwner = makeRequireRole([Role.ADMIN, Role.OWNER]);

module.exports = function installBedrijfRouter(superRouter) {
  const router = new Router({
    prefix: '/bedrijf',
  });

  //GET-request
  router.get('/', getBedrijven);
  router.post('/', upload.single("image"), async (ctx) => {
    await createBedrijf(ctx);
  });

  router.delete('/:id', requireAuthentication, requireAdminOrOwner, removeBedrijf);


  superRouter.use(router.routes()).use(router.allowedMethods());
}
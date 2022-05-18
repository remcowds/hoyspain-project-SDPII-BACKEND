const Router = require('@koa/router');
const imagesService = require('../service/imagesService');
const multer = require('@koa/multer');
const path = require('path');
const {
  requireAuthentication
} = require('../core/auth');

const createImage = async (file) => {
  return await imagesService.createImage(file);
};

const uploadPictures = async (ctx) => {
  try{
    let files = ctx.request.files;
    console.log(ctx.request.files)
    urlList = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let url = await createImage(file)
      urlList.push(url);
    }

    return urlList;
  }
  catch(err) {
    console.log(err)
    return err;
  }
}

function fileFilterFunc (req, file, cb) {
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

const upload = multer({ dest: 'uploads/', fileFilter:fileFilterFunc, storage:storage });


// function installImagesRouter(superRouter) {
//   const router = new Router({
//     prefix: '/image',
//   });

//   router.post(
//     '/',requireAuthentication,
//     upload.array('uploadedImages', 10),
//     uploadPictures
//     );

//   superRouter.use(router.routes()).use(router.allowedMethods());
// }

module.exports = {
  //installImagesRouter,
  uploadPictures
}

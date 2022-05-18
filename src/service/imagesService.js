const imagesRepo = require('../repository/imagesRepos');

const createImage = async (image) => {
  return await imagesRepo.createImage(image);
};

const createImageBedrijf = async (image) => {
  return await imagesRepo.createImageBedrijf(image);
};

module.exports = {
  createImage,
  createImageBedrijf,
}
const bedrijfRepos = require('../repository/bedrijfRepos');

const getBedrijven = async (queryParams) => {
  return await bedrijfRepos.getBedrijven(queryParams);
};

const createBedrijf = async ({body, url}) => {
  return await bedrijfRepos.createBedrijf({body, url});
}

const deleteById = async (id) => {  
  return await bedrijfRepos.deleteById(id);
};

const getById = (id) => {  
  return bedrijfRepos.findById(id);
};

module.exports = {
  getBedrijven,
  createBedrijf,
  deleteById,
  getById
}
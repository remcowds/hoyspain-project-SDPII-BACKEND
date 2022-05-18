const woningRepos = require('../repository/woningRepos');

const getAllWoningen = async (queryparams) => {
  const sortering = queryparams.orderBy;

  const filters = {};
  const filterArray = Object.entries(queryparams);

  const temp = {}
  const sterren = []

  filterArray.forEach(filterpair => {
    if (filterpair[0].includes('Ster')) {
      sterren.push(Number(filterpair[1].replace(/\D/g, '')));
    } else if (filterpair[0].includes('Prijs')) {
      filters[filterpair[0]] = Number(filterpair[1])
    } else if (filterpair[0].includes('regio')) {
      filters.regio_id = filterpair[1]
    } else if (filterpair[0].includes('aantalPersonen')) {
      filters.aantalPersonen = Number(filterpair[1])
    } else if (filterpair[0].includes('datumVan')) {
      filters.datumVan = filterpair[1]
    } else if (filterpair[0].includes('datumTot')) {
      filters.datumTot = filterpair[1]
    } else if (!filterpair[0].includes('orderBy')) {
      //checks frontend true/false | 1/0 
      temp[filterpair[0]] = 1
    }
  });
  filters.rating = sterren;
  filters.checks = temp;
  filters.orderBy = sortering

  return await woningRepos.getAllWoningen(filters);
};

const getWoningenByUser = async (userID) => {
  return await woningRepos.getWoningenByUser(userID);
}

const getWoningByID = async (id) => {
  return await woningRepos.getWoningByID(id);
};

const updateWoning = async ({
  id,
  body,
  urls
}) => {
  body.linkAfbeeldingen = JSON.stringify(urls);
  return await woningRepos.updateWoning(id, body);
};


const createWoning = async ({
  body,
  urls
}) => {
  body.linkAfbeeldingen = JSON.stringify(urls)

  return await woningRepos.createWoning(body);
};

const removeWoning = async (id) => {
  return await woningRepos.removeWoning(id);
};

const getWoningenByIDS = async (body) => {
  return await woningRepos.getWoningenByIDS(body);
};

module.exports = {
  getAllWoningen,
  getWoningenByUser,
  getWoningByID,
  updateWoning,
  createWoning,
  removeWoning,
  getWoningenByIDS,
}
const recensieRepos = require('../repository/recensieRepos');

const getBeoordelingenByWoning = async (woningID) => {
  return await recensieRepos.getBeoordelingenByWoning(woningID);
};

const createBeoordeling = async (recensieBody) => {
  return await recensieRepos.createBeoordeling(recensieBody);
}

module.exports = {
  getBeoordelingenByWoning,
  createBeoordeling
}
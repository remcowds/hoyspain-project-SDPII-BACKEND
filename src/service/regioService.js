const config = require('config');
const { getChildLogger } = require('../core/logging');
const regioRepos = require('../repository/regioRepos');


const getAll = async (
    limit = 100,
    offset = 0,
  ) => {  
    const data = await regioRepos.getAllRegios({
      limit,
      offset
    });
    const totalCount = await regioRepos.findCount();
    return {
      data,
      count: totalCount,
      limit,
      offset,
    };
  };

const getById = (id) => {  
  return regioRepos.findById(id);
};

const updateById = (id, { name }) => {
  const updatedRegio = { name };  
  return regioRepos.updateById(id, updatedRegio);
};

const deleteById = async (id) => {  
  await regioRepos.deleteById(id);
};

module.exports = {
  getAll,
  getById,  
  updateById,
  deleteById,
};
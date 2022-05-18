const dienstenRepos = require('../repository/dienstenRepos');

const getDiensten = async () => {
  return await dienstenRepos.getDiensten();
};
//create diensten 
const addDienst = async (dienst) => {
  return await dienstenRepos.addDienst(dienst);
};

const deleteById = async (id) => {  
  return await dienstenRepos.deleteById(id);
};

module.exports = {
  getDiensten, addDienst, deleteById
}
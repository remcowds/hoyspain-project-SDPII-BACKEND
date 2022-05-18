const favorietenRepos = require('../repository/favorietenRepos');

const getFavorieten = async (queryParams) => {
  return await favorietenRepos.getFavorieten(queryParams);
};

const getFavorietenByUser = async (userID) => {
  return await favorietenRepos.getFavorietenByUser(userID);
}

const addFavorieten = async (favBody) => {
  return await favorietenRepos.addFavorieten(favBody);
}

const removeFavoriet = async (favID) => {
  return await favorietenRepos.removeFavoriet(favID);
}

module.exports = {
    getFavorieten,
    addFavorieten,
    getFavorietenByUser,
    removeFavoriet
}
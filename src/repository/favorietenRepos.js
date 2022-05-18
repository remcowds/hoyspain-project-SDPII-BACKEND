const { tables, getKnex } = require("../data/index");
const uuid = require("uuid");
const tableFavorieten = tables.favorieten;


const getFavorieten = async (queryParams) => {  

  const favorieten = await getKnex()(tableFavorieten).select()
  return favorieten

}


const getFavorietenByUser = async (userID) => {
  const favorieten = await getKnex()(tableFavorieten)
    .select("favorietID", "woningID", "userID")
    //.join(tables.gebruiker, `${tableFavorieten}.userID`, '=', `${tables.gebruiker}.userID`)
    .where({
      userID,
    });

  return favorieten;
};

const addFavorieten = async (favorietenBody) => { 
  const favorietID = uuid.v4();
  await getKnex()(tableFavorieten).insert({ ...favorietenBody, favorietID });
};


const removeFavoriet = async (favID) => {
    const ret = await getKnex()(tableFavorieten).where({
        favorietID: favID
    }).del();
  
    if (ret === 0) {
      throw new Error(`favoriet met id ${favID} niet gevonden`)
    }
  };

module.exports = {
  getFavorietenByUser,
  addFavorieten,
  removeFavoriet,
  getFavorieten,
};

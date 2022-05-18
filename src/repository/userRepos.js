const uuid = require('uuid');
const ServiceError = require('../core/serviceError');
const {
  tables,
  getKnex
} = require('../data');


const getAllUsers = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.gebruiker)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy('voornaam', 'ASC');
};

const findCount = async () => {
  const [count] = await getKnex()(tables.gebruiker)
    .count();
  return count['count(*)'];
};

const findById = (userID) => {
  return getKnex()(tables.gebruiker)
    .select()
    .where('userID', userID).first();
};

const findByEmail = (email) => {
  return getKnex()(tables.gebruiker)
    .where('emailAdres', email)
    .first();
};

const create = async ({
  userID,
  voornaam,
  achternaam,
  emailAdres,
  // geboorteDatum,
  // adres,
  passwordHash,
  roles,
  telefoonnummer,
}) => {
  
  try {
    const userID = uuid.v4();
    let test = await findByEmail(emailAdres)
    if (!test) {
      await getKnex()(tables.gebruiker)
      .insert({
        userID,
        voornaam,
        achternaam,
        emailAdres,
        // geboorteDatum,
        // adres,
        telefoonnummer,
        wachtwoordhash: passwordHash,
        role: JSON.stringify(roles),
      });
    return await findById(userID);
    }
    else{
      //throw new Error('Email already exists');
      throw ServiceError.unauthorized('Het opgegeven email bestaat al');

    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateById = async (userID, {
  voornaam,
  achternaam,
  // adres,
  // geboorteDatum,
  telefoonnummer,
  
  emailAdres
}) => {

  try {
    await getKnex()(tables.gebruiker)
      .update({
        voornaam,
        achternaam,
        
        telefoonnummer,
        // geboorteDatum,
        // adres,
        emailAdres
      })
      .where('userID', userID);
    return await findById(userID);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateRolByID = async ({userID, rol}) => {

  try {
    await getKnex()(tables.gebruiker)
      .update({
        role:rol
      })
      .where('userID', userID);
    return await findById(userID);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    await getKnex().raw(`set foreign_key_checks = 0`);
    //eerst verwijderen van favorieten
    //dan verwijderen woningen van deze user!
    //dan verwijderen van recensies
    //dan verwijderen van boekingen
    //dan verwijderen van gebruiker
    const favosDeleted = await getKnex()(tables.favorieten)
    .delete()
    .where('userID', id);

    const woningenDeleted = await getKnex()(tables.woning).delete().where('userID', id);

    const recensiesDeleted = await getKnex()(tables.beoordeling).delete().where('userID', id);
    
    const boekingenDeleted = await getKnex()(tables.boeking).delete().where('userID', id);

    const rowsAffected = await getKnex()(tables.gebruiker)
    .delete()
    .where('userID', id);
    await getKnex().raw(`set foreign_key_checks = 1`);
    return rowsAffected > 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  findCount,
  findById,
  findByEmail,
  create,
  updateById,
  updateRolByID,
  deleteById,
};
const boekingRepos = require('../repository/boekingRepos');
const sendMail = require('../sendMail');

const getBoekingen = async (queryParams) => {
  return await boekingRepos.getBoekingen(queryParams);
};

const getBoekingenByWoning = async (woningID) => {
  return await boekingRepos.getBoekingenByWoning(woningID);
}

const createBoeking = async (boekingBody) => {
  const booking =  await boekingRepos.createBoeking(boekingBody);
  sendMail.sendMailBooking(booking);
  return booking;
}

module.exports = {
  getBoekingen,
  getBoekingenByWoning,
  createBoeking
}
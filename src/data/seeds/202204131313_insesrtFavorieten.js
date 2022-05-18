const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    //om leeg te maken eerst de FK check uitzetten
    await knex.raw(`set foreign_key_checks = 0`);

    //delete
    await knex(tables.favorieten).del();

    //FK weer aanzetten
    await knex.raw(`set foreign_key_checks = 1`);

    //data toevoegen
    
    await knex(tables.favorieten).insert([
      {
        favorietID: "ID van beoordeling 1",
        woningID: "woningID-1",
        userID: "7c9af21e-5a3d-445b-952c-0f8d2f679309",        
      },
      {
        favorietID: "ID van beoordeling 2",
        woningID: "woningID-3",
        userID: "4c9af21e-5a3d-445b-952c-0f8d2f679309",    
          
      },   
      {
        favorietID: "ID van beoordeling 3",
        woningID: "woningID-2",
        userID: "4c9af21e-5a3d-445b-952c-0f8d2f679309",    
           
      },        
    ]);
  },
};


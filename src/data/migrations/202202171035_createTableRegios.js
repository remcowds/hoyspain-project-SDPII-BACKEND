const { tables } = require('..');
module.exports  = {
  up: async (knex) => {
    await knex.schema.createTable(tables.regio, (table) => {
      table.string('id').primary()    

      table.string('regio', 255)
        .notNullable();              
            
    });
  },
    
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.regio);
  },
};
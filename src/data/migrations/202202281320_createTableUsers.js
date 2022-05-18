const {
  tables
} = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.gebruiker, (table) => {
      table.uuid('userID').primary();
      table.string('emailAdres', 80);
      table.string('wachtwoordhash', 150).notNullable();
      table.string('voornaam', 25).notNullable();
      table.string('achternaam', 50).notNullable();
      // table.string('adres', 100).notNullable();
      table.string('telefoonnummer', 20).notNullable();
      // table.date('geboorteDatum').notNullable();
      table.string('role', 15).notNullable();
      
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.gebruiker);
  }
}
const {
  tables
} = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.dienst, (table) => {
      table.string('dienstID').primary();
      table.string('dienstNaam').notNullable();
      table.string('beschrijvingDienst');
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.dienst);
  }
}
const {
  tables
} = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.favorieten, (table) => {
      table.string('favorietID').primary();
      table.string('woningID').notNullable();
      table.uuid('userID').notNullable();

      //Foreign Keys
      table.foreign('userID', 'fk_favoriet_gebruiker').references('gebruiker.userID');
      table.foreign('woningID', 'fk_favoriet_woning').references('woning.woningID');
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.favorieten);
  }
}
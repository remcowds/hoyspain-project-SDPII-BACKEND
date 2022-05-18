const {
  tables
} = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.beoordeling, (table) => {
      table.string('beoordelingsID').primary();
      table.string('woningID').notNullable();
      table.uuid('userID').notNullable();
      table.integer('aantalSterren').notNullable();
      table.string('tekst').notNullable();
      table.date('datumBeoordeling').notNullable();

      //Foreign Keys
      table.foreign('userID', 'fk_beoordeling_gebruiker').references('gebruiker.userID');
      table.foreign('woningID', 'fk_beoordeling_woning').references('woning.woningID');
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.beoordeling);
  }
}
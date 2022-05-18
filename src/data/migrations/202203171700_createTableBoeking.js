const {
  tables
} = require("..");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.boeking, (table) => {
      table.increments('boekingsnummer');
      table.string('boekingsID');
      table.uuid('userID').notNullable();
      table.string('woningID').notNullable();
      table.date('datumAankomst').notNullable();
      table.date('datumVertrek').notNullable();
      table.integer('aantalPersonenBoeking').notNullable();
      table.integer('aantalNachten');
      table.string('verzekering');
      table.float('verzekeringsprijs');
      table.float('reisPrijs').notNullable();
      table.float('totaalPrijs').notNullable();

      //Foreign Keys
      table.foreign('userID', 'fk_boeking_user').references('gebruiker.userID');
      table.foreign('woningID', 'fk_boeking_woning').references('woning.woningID');
    })
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.beoordeling);
  }
}
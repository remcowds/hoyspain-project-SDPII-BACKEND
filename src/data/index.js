const config = require('config');
const Knex = require('knex');
const {
  join
} = require('path');

const isDevelopment = config.get('env') === 'development';

let knex;

const initializeData = async () => {
  const knexOptions = {
    client: config.get('connectionDB.client'),
    connection: {
      host: config.get('connectionDB.host'),
      port: config.get('connectionDB.port'),
      user: config.get('connectionDB.user'),
      password: config.get('connectionDB.password'),
      database: null,
    },
    migrations: {
      tableName: 'knex_metadata',
      directory: join('src', 'data', 'migrations'),
    },
    seeds: {
      directory: join('src', 'data', 'seeds'),
    },
    debug: false
  };
  
  knex = Knex(knexOptions);
  
  try {
    //connectie testen
    await knex.raw('select 1');
    
    //creation database
    await knex.raw(
      `create database if not exists ${config.get('connectionDB.name')}`
      );
      
      //database instellen
      await knex.destroy();
      knexOptions.connection.database = config.get('connectionDB.name');
      knex = Knex(knexOptions);
      
      //connectie opnieuw testen
      await knex.raw('select 1');
    } catch (error) {
      console.log(`Something went wrong while connecting with the db:\n${error}`);
    }
    
    //migrations
    let migrationsFailed = true;
    try {
      await knex.migrate.latest();
    migrationsFailed = false;
  } catch (error) {
    console.log(`Error migrating: ${error}`)
  }

  //migrations failed -> undo de laatste
  if (migrationsFailed) {
    try {
      await knex.migrate.down();
    } catch (error) {
      console.log(`Error migrating down: ${error}`)
    }
    throw new Error('Migrations failed');
  }

  //seeds enkel development!
  if (isDevelopment) {
    //alle seeds runnen
    try {
      await knex.seed.run();
    } catch (error) {
      console.log(`Error seeding: ${error}`)
    }
  }
  console.log('\x1b[32m%s\x1b[0m', '[knex] Knex running')
}

const getKnex = () => {
  if (knex !== null) {
    return knex;
  } else {
    console.log('geen instantie van knex');
  }
}

const shutdownData = async () => {
  await knex.destroy();
}

const tables = Object.freeze({
  gebruiker: 'gebruiker',
  woning: 'woning',
  beoordeling: 'beoordeling',
  regio: 'regio',
  boeking: 'boeking',
  beoordeling: 'beoordeling',
  dienst: 'dienst',
  bedrijf: 'bedrijf',
  favorieten: 'favorieten'
});

module.exports = {
  initializeData,
  getKnex,
  shutdownData,
  tables
}
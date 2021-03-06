module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'longzongbuy',
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migration/*.ts'],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migration',
    },
  },
  {
    name: 'test',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'longzongbuy',
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migration/*.ts'],
    cli: {
      entitiesDir: 'src/models',
      migrationsDir: 'src/migration',
    },
    // Make this true to print sql statements
    logging: false,
  },
];

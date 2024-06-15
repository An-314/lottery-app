// knexfile.js
module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'anzreww',
            password: '271828',
            database: 'mydatabase'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    production: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'anzreww',
            password: '271828',
            database: 'mydatabase'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};

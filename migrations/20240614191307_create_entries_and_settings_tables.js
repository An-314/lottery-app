// migrations/<timestamp>_create_entries_and_settings_tables.js
exports.up = function (knex) {
    return knex.schema.createTable('entries', function (table) {
        table.increments('id');
        table.string('student_id').notNullable().unique();
        table.timestamps(true, true);
    }).createTable('settings', function (table) {
        table.string('key').primary();
        table.string('value').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('entries').dropTable('settings');
};

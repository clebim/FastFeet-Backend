import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('recipients', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('street').notNullable();
    table.decimal('number').notNullable();
    table.string('complement').notNullable();
    table.string('state').notNullable();
    table.string('city').notNullable();
    table.decimal('zip_code').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('recipients');
}

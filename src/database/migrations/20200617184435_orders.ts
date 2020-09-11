import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table
      .integer('recipient_id')
      .notNullable()
      .references('id')
      .inTable('recipients')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .integer('deliveryman_id')
      .notNullable()
      .references('id')
      .inTable('couriers')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('product').notNullable();
    table.date('canceled_at');
    table.date('start_date');
    table.date('end_date');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('orders');
}

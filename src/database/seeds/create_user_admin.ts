import * as Knex from 'knex';

const bcrypt = require('bcryptjs');

export async function seed(knex: Knex): Promise<any> {
  await knex('users').insert([
    {
      name: 'Distribuidora FastFeet',
      email: 'admin@fastfeet.com',
      password_hash: bcrypt.hashSync('123456', 8),
      admin: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

import bcrypt from 'bcryptjs';
import knex from '../database/connection';

async function checkPassword(email: string, password: string) {
  const password_hash = await knex('users')
    .where('email', email)
    .select('password_hash')
    .first();

  return bcrypt.compare(password, password_hash.password_hash);
}

export default checkPassword;

import { eq } from 'drizzle-orm';
import { db } from './database';
import { usersTable } from './database/schema';

async function seedAdmin() {
  try {
    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, 'admin'));
    if (!user) {
      await db.insert(usersTable).values({
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'pass',
      });
    }
    console.log('Admin seed complete');
  } catch (err) {
    console.error('Failed to seed admin', err);
  }
}
function seed() {
  seedAdmin();
}

seed();

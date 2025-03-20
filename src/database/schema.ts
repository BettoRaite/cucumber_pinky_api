import {
  pgTable,
  varchar,
  text,
  timestamp,
  unique,
  serial,
  integer,
  boolean,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { title } from 'node:process';

export const accountsTable = pgTable(
  'accounts',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    type: varchar('type').notNull(),
    provider: varchar('provider').notNull(),
    providerAccountId: varchar('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: timestamp('expires_at').notNull(),
    tokenType: varchar('token_type'),
    scope: varchar('scope'),
    idToken: text('id_token'),
    sessionState: varchar('session_state'),
  },
  (table) => ({
    uniqueProvider: unique('unique_provider').on(
      table.provider,
      table.providerAccountId,
    ),
  }),
);

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique(),
  password: varchar('password').notNull(),
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profilesTable = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => usersTable.id)
    .unique()
    .notNull(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  bio: text('bio'),
  avatarUrl: varchar('avatar_url', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const activitiesTable = pgTable(
  'activities',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => usersTable.id)
      .notNull(),
    name: text().notNull(),
    start: timestamp('start').notNull(),
    end: timestamp('end').notNull(),
    color: text({}).notNull(),
    weekdays: text({
      enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ],
    })
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),
    isRepeating: boolean().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  // (table) => [check('duration_check', sql`${table.start} < ${table.end}`)],
);

export const refreshTokensTable = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token').unique().notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const resetTokensTable = pgTable('reset_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const emailVerificationTokensTable = pgTable(
  'email_verification_tokens',
  {
    id: serial('id').primaryKey(),
    token: varchar('token').unique().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
);

export type UserInsert = typeof usersTable.$inferInsert; // VERY Good
export type UserSelect = typeof usersTable.$inferSelect; // VERY Good
export type AccountInsert = typeof accountsTable.$inferInsert; // VERY Good
export type AccountSelect = typeof accountsTable.$inferSelect; // VERY Good
export type RefreshTokenInsert = typeof refreshTokensTable.$inferInsert; // VERY Good
export type RefreshTokenSelect = typeof refreshTokensTable.$inferSelect; // VERY Good
export type ResetTokenInsert = typeof resetTokensTable.$inferInsert; // VERY Good
export type ResetTokenSelect = typeof resetTokensTable.$inferSelect; // VERY Good
export type EmailVerificationTokenInsert =
  typeof emailVerificationTokensTable.$inferInsert; // VERY Good
export type EmailVerificationTokenSelect =
  typeof emailVerificationTokensTable.$inferSelect; // VERY Good
export type ProfileInsert = typeof profilesTable.$inferInsert; // VERY Good
export type ProfileSelect = typeof profilesTable.$inferSelect; // VERY Good
export type ActivityInsert = typeof activitiesTable.$inferInsert; // VERY Good
export type ActivitySelect = typeof activitiesTable.$inferSelect; // VERY Good

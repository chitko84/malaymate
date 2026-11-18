import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const rooms=sqliteTable('multiplayer_rooms',{code:text('code').primaryKey(),payload:text('payload').notNull(),version:integer('version').notNull().default(0),expiresAt:integer('expires_at').notNull()});
export const results=sqliteTable('multiplayer_results',{id:text('id').primaryKey(),name:text('name').notNull(),score:integer('score').notNull(),correct:integer('correct').notNull(),levelId:text('level_id').notNull(),playedAt:integer('played_at').notNull()});

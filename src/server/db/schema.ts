// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ghost-stack-${name}`);

export const users = createTable(
  "user",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    clerkId: d.varchar({ length: 64 }).notNull().unique(),
    name: d.varchar({ length: 256 }),
    email: d.varchar({ length: 256 }).notNull().unique(),
    imageUrl: d.varchar({ length: 512 }).$default(() => ""),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("user_idx").on(t.name)],
);

export const userRelations = relations(users, ({ many }) => ({
  stacks: many(stacks),
}));

export const stacks = createTable(
  "stack",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: d.varchar({ length: 256 }).notNull(),
    description: d.text().$default(() => ""),
    userId: d.uuid("user_id").notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    stack: d
      .jsonb("stack")
      .notNull()
      .$default(() => ({})),
  }),
  (t) => [index("stack_idx").on(t.name)],
);

export const stackRelations = relations(stacks, ({ one }) => ({
  author: one(users, {
    fields: [stacks.userId],
    references: [users.id],
  }),
}));

import { pgTable, pgPolicy, bigserial, text, index, serial, numeric, integer, timestamp, varchar, date, foreignKey, uuid, unique, bigint, doublePrecision, json, boolean, pgEnum, pgSchema } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
// import { users } from "@/app/profile/components/team-data";

export const accountStatusEnum = pgEnum("accountStatus", ['ACTIVE', 'PENDING', 'ARCHIVED', 'SUSPENDED', 'UNVERIFIED'])
export const userRoleTypeEnum = pgEnum("user_role_type", ['ADMIN', 'BROKER', 'INVESTOR', 'BORROWER', 'SUPERADMIN', 'PENDING'])

const authSchema = pgSchema('auth');
export const users = authSchema.table("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	email: text("email").notNull(),
	phone: text("phone")
});

export const notes = pgTable("notes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: text(),
}, (table) => [
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow authenticated users to select from notes", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to insert into notes", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update notes", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from notes", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const properties = pgTable("properties", {
	id: serial().primaryKey().notNull(),
	address: text().notNull(),
	ltv: numeric({ precision: 5, scale:  2 }).notNull(),
	amount: integer().notNull(),
	listDate: timestamp("list_date", { withTimezone: true, mode: 'string' }).notNull(),
	region: varchar({ length: 10 }).notNull(),
	imgUrls: text("img_urls"),
	propertyType: varchar("property_type", { length: 50 }).notNull(),
	interestRate: numeric("interest_rate", { precision: 5, scale:  2 }).notNull(),
	dateFunded: date("date_funded"),
	maturityDate: date("maturity_date"),
	latLong: varchar("lat_long", { length: 50 }),
	priorE: text("prior_e"),
	mortgageType: integer("mortgage_type"),
	term: integer(),
	marketValue: integer("market_value"),
}, (table) => [
	index("idx_list_date").using("btree", table.listDate.asc().nullsLast().op("timestamptz_ops")),
	index("idx_property_type").using("btree", table.propertyType.asc().nullsLast().op("text_ops")),
	index("idx_region").using("btree", table.region.asc().nullsLast().op("text_ops")),
	pgPolicy("Enable read access for all users", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow authenticated users to select from properties", { as: "permissive", for: "select", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to insert into properties", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update properties", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from properties", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const draftListings = pgTable("draft_listings", {
	draftListingId: uuid("draft_listing_id").defaultRandom().primaryKey().notNull(),
	brokerAccountId: uuid("broker_account_id"),
	propertyId: uuid("property_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.brokerAccountId],
			foreignColumns: [account.accountId],
			name: "draft_listings_broker_account_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [property.propertyId],
			name: "draft_listings_property_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow authenticated users to select from draft_listings", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into draft_listings", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update draft_listings", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from draft_listings", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const accountStatus = pgTable("account_status", {
	accountStatusId: uuid("account_status_id").defaultRandom().primaryKey().notNull(),
	status: accountStatusEnum("status").default('PENDING').notNull(),
}, (table) => [
	pgPolicy("Allow authenticated users to select from account_status", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into account_status", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update account_status", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from account_status", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const pendingUser = pgTable("pending_user", {
	pendingUserId: uuid("pending_user_id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	roleId: text("role_id").notNull(),
	firstName: text("first_name").notNull(),
	middleName: text("middle_name"),
	lastName: text("last_name").notNull(),
	profilePicture: text("profile_picture"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "pending_user_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow authenticated users to select from pending_user", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into pending_user", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update pending_user", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from pending_user", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const account = pgTable("account", {
	accountId: uuid("account_id").defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	firstName: text("first_name").default('').notNull(),
	middleName: text("middle_name").default(''),
	lastName: text("last_name").default('').notNull(),
	profilePicture: text("profile_picture").default(''),
	accountStatus: accountStatusEnum("account_status").default('PENDING'),
	phone: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_user_id_fkey"
		}),
	unique("account_phone_key").on(table.phone),
	pgPolicy("Allow authenticated users to select from account", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into account", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update account", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from account", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const userRoles = pgTable("user_roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "user_roles_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	userId: uuid("user_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roleId: bigint("role_id", { mode: "number" }).notNull(),
}, (table) => [
	index("idx_role_id").using("btree", table.roleId.asc().nullsLast().op("int8_ops")),
	index("idx_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "user_roles_role_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_roles_user_id_fkey"
		}),
	unique("user_roles_id_key").on(table.id),
	unique("unique_user_role").on(table.userId, table.roleId),
	pgPolicy("Allow authenticated users to select from user_roles", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into user_roles", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update user_roles", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from user_roles", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const roles = pgTable("roles", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "roles_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	roleName: text("role_name").notNull(),
}, (table) => [
	unique("roles_role_name_key").on(table.roleName),
	pgPolicy("Allow authenticated users to select from roles", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into roles", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update roles", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from roles", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const listings = pgTable("listings", {
	listingId: uuid("listing_id").defaultRandom().primaryKey().notNull(),
	propertyId: uuid("property_id"),
	accountId: uuid("account_id"),
	listedDate: date("listed_date"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [account.accountId],
			name: "listings_account_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [property.propertyId],
			name: "listings_property_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow authenticated users to select from listings", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into listings", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update listings", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from listings", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const activeListings = pgTable("active_listings", {
	activeListingId: uuid("active_listing_id").defaultRandom().primaryKey().notNull(),
	listingId: uuid("listing_id"),
	listingDateActive: timestamp("listing_date_active", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [listings.listingId],
			name: "active_listings_listing_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow authenticated users to select from active_listings", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into active_listings", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update active_listings", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from active_listings", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const property = pgTable("property", {
	propertyId: uuid("property_id").defaultRandom().primaryKey().notNull(),
	propertyType: text("property_type").default('').notNull(),
	address: text().notNull(),
	region: text().default('').notNull(),
	ltv: doublePrecision().default(sql`'0'`).notNull(),
	lat_long: text().default(''),
	amount: doublePrecision().default(sql`'0'`).notNull(),
	mortgageType: text("mortgage_type").default('').notNull(),
	interestRate: doublePrecision("interest_rate").notNull(),
	term: json().notNull(),
	priorEncumbrances: text("prior_encumbrances").notNull(),
	estimatedFairMarketValue: doublePrecision("estimated_fair_market_value").notNull(),
	imgs: text().default('').notNull(),
	summary: text().notNull(),
	dateFunded: date("date_funded").notNull(),
	privateDocs: text("private_docs").default('').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Allow authenticated users to select from property", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into property", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update property", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from property", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const savedProperties = pgTable("saved_properties", {
	savedPropertiesId: uuid("saved_properties_id").defaultRandom().primaryKey().notNull(),
	accountId: uuid("account_id").notNull(),
	activeListingId: uuid("active_listing_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.accountId],
			foreignColumns: [account.accountId],
			name: "saved_properties_account_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.activeListingId],
			foreignColumns: [activeListings.activeListingId],
			name: "saved_properties_active_listing_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow authenticated users to select from saved_properties", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into saved_properties", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update saved_properties", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from saved_properties", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const archivedListings = pgTable("archived_listings", {
	archivedListingId: uuid("archived_listing_id").defaultRandom().primaryKey().notNull(),
	listingId: uuid("listing_id").notNull(),
	archivedStatus: text("archived_status").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [listings.listingId],
			name: "archived_listings_listing_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow authenticated users to select from archived_listings", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into archived_listings", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update archived_listings", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from archived_listings", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);

export const soldListings = pgTable("sold_listings", {
	soldListingsId: uuid("sold_listings_id").defaultRandom().primaryKey().notNull(),
	listingId: uuid("listing_id").notNull(),
	buyerAccountId: uuid("buyer_account_id").notNull(),
	finalized: boolean().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.buyerAccountId],
			foreignColumns: [account.accountId],
			name: "sold_listings_buyer_account_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.listingId],
			foreignColumns: [listings.listingId],
			name: "sold_listings_listing_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	pgPolicy("Allow authenticated users to select from sold_listings", { as: "permissive", for: "select", to: ["authenticated"], using: sql`true` }),
	pgPolicy("Allow authenticated users to insert into sold_listings", { as: "permissive", for: "insert", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to update sold_listings", { as: "permissive", for: "update", to: ["authenticated"] }),
	pgPolicy("Allow authenticated users to delete from sold_listings", { as: "permissive", for: "delete", to: ["authenticated"] }),
]);
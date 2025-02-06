import { relations } from "drizzle-orm/relations";
import { account, draftListings, property, usersInAuth, pendingUser, roles, userRoles, listings, activeListings, savedProperties, archivedListings, soldListings } from "./schema";

export const draftListingsRelations = relations(draftListings, ({one}) => ({
	account: one(account, {
		fields: [draftListings.brokerAccountId],
		references: [account.accountId]
	}),
	property: one(property, {
		fields: [draftListings.propertyId],
		references: [property.propertyId]
	}),
}));

export const accountRelations = relations(account, ({one, many}) => ({
	draftListings: many(draftListings),
	usersInAuth: one(usersInAuth, {
		fields: [account.userId],
		references: [usersInAuth.id]
	}),
	listings: many(listings),
	savedProperties: many(savedProperties),
	soldListings: many(soldListings),
}));

export const propertyRelations = relations(property, ({many}) => ({
	draftListings: many(draftListings),
	listings: many(listings),
}));

export const pendingUserRelations = relations(pendingUser, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [pendingUser.userId],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	pendingUsers: many(pendingUser),
	accounts: many(account),
	userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({one}) => ({
	role: one(roles, {
		fields: [userRoles.roleId],
		references: [roles.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [userRoles.userId],
		references: [usersInAuth.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	userRoles: many(userRoles),
}));

export const listingsRelations = relations(listings, ({one, many}) => ({
	account: one(account, {
		fields: [listings.accountId],
		references: [account.accountId]
	}),
	property: one(property, {
		fields: [listings.propertyId],
		references: [property.propertyId]
	}),
	activeListings: many(activeListings),
	archivedListings: many(archivedListings),
	soldListings: many(soldListings),
}));

export const activeListingsRelations = relations(activeListings, ({one, many}) => ({
	listing: one(listings, {
		fields: [activeListings.listingId],
		references: [listings.listingId]
	}),
	savedProperties: many(savedProperties),
}));

export const savedPropertiesRelations = relations(savedProperties, ({one}) => ({
	account: one(account, {
		fields: [savedProperties.accountId],
		references: [account.accountId]
	}),
	activeListing: one(activeListings, {
		fields: [savedProperties.activeListingId],
		references: [activeListings.activeListingId]
	}),
}));

export const archivedListingsRelations = relations(archivedListings, ({one}) => ({
	listing: one(listings, {
		fields: [archivedListings.listingId],
		references: [listings.listingId]
	}),
}));

export const soldListingsRelations = relations(soldListings, ({one}) => ({
	account: one(account, {
		fields: [soldListings.buyerAccountId],
		references: [account.accountId]
	}),
	listing: one(listings, {
		fields: [soldListings.listingId],
		references: [listings.listingId]
	}),
}));
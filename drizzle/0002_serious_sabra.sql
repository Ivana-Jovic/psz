ALTER TABLE "aparments_for_rent" RENAME TO "apartments_for_rent";
ALTER TABLE "aparments_for_sale" RENAME TO "apartments_for_sale";
DROP INDEX IF EXISTS "idx_aparments_for_rent_url";
DROP INDEX IF EXISTS "idx_aparments_for_sale_url";
CREATE UNIQUE INDEX IF NOT EXISTS "idx_apartments_for_rent_url" ON "apartments_for_rent" ("url");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_apartments_for_sale_url" ON "apartments_for_sale" ("url");
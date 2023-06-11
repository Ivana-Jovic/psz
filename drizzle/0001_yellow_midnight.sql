ALTER TABLE "aparments_for_rent" ADD COLUMN "valid_offer" boolean DEFAULT true NOT NULL;
ALTER TABLE "aparments_for_sale" ADD COLUMN "valid_offer" boolean DEFAULT true NOT NULL;
ALTER TABLE "houses_for_rent" ADD COLUMN "valid_offer" boolean DEFAULT true NOT NULL;
ALTER TABLE "houses_for_sale" ADD COLUMN "valid_offer" boolean DEFAULT true NOT NULL;
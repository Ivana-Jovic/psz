ALTER TABLE "apartments_for_rent" ADD COLUMN "is_outlier" boolean DEFAULT false NOT NULL;
ALTER TABLE "apartments_for_sale" ADD COLUMN "is_outlier" boolean DEFAULT false NOT NULL;
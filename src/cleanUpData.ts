import { and, eq, isNull, like, or, lt, gt, sql } from "drizzle-orm";
import { db } from "./db/drizzle.ts";
import { housesForRent, HousesForRent } from "./db/schema/housesForRent.ts";
import { housesForSale, HousesForSale } from "./db/schema/housesForSale.ts";
import {
  apartmentsForSale,
  ApartmentsForSale,
} from "./db/schema/apartmentsForSale.ts";
import {
  apartmentsForRent,
  ApartmentsForRent,
} from "./db/schema/apartmentsForRent.ts";

export const cleanUpData = async () => {
  const hrQuery = db
    .update(housesForRent)
    .set({ validOffer: false })
    .where(
      or(
        isNull(housesForRent.url),
        isNull(housesForRent.title),
        isNull(housesForRent.price),
        isNull(housesForRent.size),
        isNull(housesForRent.location),
        isNull(housesForRent.numOfRooms),
        isNull(housesForRent.city)
      )
    );
  const hsQuery = db
    .update(housesForSale)
    .set({ validOffer: false })
    .where(
      or(
        isNull(housesForSale.url),
        isNull(housesForSale.title),
        isNull(housesForSale.price),
        isNull(housesForSale.size),
        isNull(housesForSale.location),
        isNull(housesForSale.numOfRooms),
        isNull(housesForSale.city)
      )
    );
  const arQuery = db
    .update(apartmentsForRent)
    .set({ validOffer: false })
    .where(
      or(
        isNull(apartmentsForRent.url),
        isNull(apartmentsForRent.title),
        isNull(apartmentsForRent.price),
        isNull(apartmentsForRent.size),
        isNull(apartmentsForRent.location),
        isNull(apartmentsForRent.numOfRooms),
        isNull(apartmentsForRent.city),
        like(apartmentsForRent.url, "%/stambeni-objekti/kuce%")
      )
    );
  const asQuery = db
    .update(apartmentsForSale)
    .set({ validOffer: false })
    .where(
      or(
        isNull(apartmentsForSale.url),
        isNull(apartmentsForSale.title),
        isNull(apartmentsForSale.price),
        isNull(apartmentsForSale.size),
        isNull(apartmentsForSale.location),
        isNull(apartmentsForSale.numOfRooms),
        isNull(apartmentsForSale.city),
        like(apartmentsForSale.url, "%/stambeni-objekti/kuce%")
      )
    );

  await Promise.all([hrQuery, hsQuery, arQuery, asQuery]); //Done

  const cleanup = db
    .update(apartmentsForSale)
    .set({ isOutlier: true })
    .where(
      or(
        // eq(apartmentsForSale.validOffer, false),
        // gt(apartmentsForSale.size, "1000"),
        // lt(apartmentsForSale.size, "15"),
        // gt(apartmentsForSale.numOfRooms, "8"),
        // lt(apartmentsForSale.numOfRooms, "1"),
        // gt(apartmentsForSale.numOfBathrooms, "6"),
        // lt(apartmentsForSale.numOfBathrooms, "1"),
        // lt(apartmentsForSale.price, "15000"),
        and(gt(apartmentsForSale.size, "0"), sql`price / size < 500`)
      )
    );

  await cleanup; //Done

  console.log("clean up done");
};

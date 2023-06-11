import {
  boolean,
  decimal,
  pgTable,
  serial,
  varchar,
  integer,
  uniqueIndex,
  PgTableWithColumns, // ovo treba
} from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const apartmentsForRent = pgTable(
  "apartments_for_rent",
  {
    id: serial("id").primaryKey(),
    url: varchar("url", { length: 255 }),
    title: varchar("title", { length: 255 }),
    price: decimal("price"),
    size: decimal("size"),
    location: varchar("location", { length: 255 }),
    city: varchar("city", { length: 255 }),
    yearOfConstruction: integer("year_of_construction"),
    //   landSurface: decimal("land_surface"),
    floor: integer("floor"),
    totalFloors: integer("total_floors"),
    numOfBathrooms: decimal("num_of_bathrooms"),
    numOfRooms: decimal("num_of_rooms"),
    registered: boolean("registered"),
    elevator: boolean("elevator"),
    terrace: boolean("terrace"),
    parking: boolean("parking"),
    garage: boolean("garage"),
    heatingCentral: boolean("heating_central"),
    heatingTA: boolean("heating_ta"),
    heatingAirConditioning: boolean("heating_air_conditioning"),
    heatingFloor: boolean("heating_floor"),
    heatingElectricity: boolean("heating_electricity"),
    heatingGas: boolean("heating_gas"),
    heatingSolidFuel: boolean("heating_solid_fuel"),
    heatingOther: boolean("heating_other"),
    validOffer: boolean("valid_offer").notNull().default(true),
  },
  (apartmentsForRent) => {
    return {
      urlIndex: uniqueIndex("idx_apartments_for_rent_url").on(
        apartmentsForRent.url
      ),
    };
  }
);

export type ApartmentsForRent = InferModel<typeof apartmentsForRent>; // return type when queried
export type NewApartmentsForRent = InferModel<
  typeof apartmentsForRent,
  "insert"
>; // insert type

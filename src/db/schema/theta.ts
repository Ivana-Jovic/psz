import { decimal, pgTable, serial } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const theta = pgTable("theta", {
  id: serial("id").primaryKey(),
  thetaZero: decimal("theta_zero"),
  size: decimal("size"),
  location: decimal("location"),
  yearOfConstruction: decimal("year_of_construction"),
  floor: decimal("floor"),
  numOfBathrooms: decimal("num_of_bathrooms"),
  numOfRooms: decimal("num_of_rooms"),
  registered: decimal("registered"),
  elevator: decimal("elevator"),
  terrace: decimal("terrace"),
  parking: decimal("parking"),
  garage: decimal("garage"),
});

export type Theta = InferModel<typeof theta>; // return type when queried
export type NewTheta = InferModel<typeof theta, "insert">; // insert type

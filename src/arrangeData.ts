import { sql, eq, desc, or, and, isNull, gt, lt, inArray } from "drizzle-orm";
import { db } from "./db/drizzle.ts";
import {
  ApartmentsForSale,
  apartmentsForSale,
} from "./db/schema/apartmentsForSale.ts";
import { top5locations } from "./top5Locations.ts";
import { distances } from "./distances.ts";
// import distances from "distances.json";

export type Row = {
  [x: string]: number;
  // | string;
  // id: number;
  // url: string;
  // title: string;
  price: number;
  size: number;
  location: number;
  yearOfConstruction: number;
  floor: number;
  numOfBathrooms: number;
  numOfRooms: number;
  registered: number;
  elevator: number;
  terrace: number;
  parking: number;
  garage: number;
};
const boolToNumber = (bool: boolean | null) => {
  return bool ? +bool : 0;
};

const getData = async () => {
  // const loc = ['konjarnik', 'novi beograd', 'mirijevo ii']; // prettier-ignore
  const locNew = top5locations.map(
    (location: string) => "beograd, " + location.toLowerCase()
  );

  const data = await db
    .select()
    .from(apartmentsForSale)
    .where(
      and(
        eq(apartmentsForSale.isOutlier, false),
        inArray(apartmentsForSale.location, locNew)
      )
    );

  return data;
};
export const getAvg = async () => {
  const locNew = top5locations.map(
    (location: string) => "beograd, " + location.toLowerCase()
  );
  const data: any[] = await db
    .select({
      avgBath: sql<number>`avg(num_of_bathrooms)`,
      avgYear: sql<number>`avg(year_of_construction)`,
      minPrice: sql<number>`min(price)`,
      maxPrice: sql<number>`max(price)`,
      minSize: sql<number>`min(size)`,
      maxSize: sql<number>`max(size)`,
      minRooms: sql<number>`min(num_of_rooms)`,
      maxRooms: sql<number>`max(num_of_rooms)`,
      minBath: sql<number>`min(num_of_bathrooms)`,
      maxBath: sql<number>`max(num_of_bathrooms)`,
      minYear: sql<number>`min(year_of_construction)`,
      maxYear: sql<number>`max(year_of_construction)`,
    })
    .from(apartmentsForSale)
    .where(
      and(
        eq(apartmentsForSale.isOutlier, false),
        inArray(apartmentsForSale.location, locNew)
      )
    );

  return data;
};
const normalize = (val: number, min: number, max: number) => {
  return (val - +min) / (+max - +min);
};
export const deNormalize = (norm: number, min: number, max: number) => {
  return norm * (+max - +min) + +min;
};

const normalizeLocation = (val: number) => {
  const values = Object.values(distances);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  return normalize(val, minValue, maxValue);
};
const floorTmp = (floor: number | null, totalFloors: number | null) => {
  if (floor && totalFloors) {
    if (floor === 0) return 0;
    if (floor === totalFloors) return 2;
  }
  return 1;
};
// sve kolone normalizovatii price, size, broj soba, broj kupatila
// lokacije pretvoriti u udaljenosti
// ono gde je prazno popuniti sa sr vr
// boolean pretvoriti u 0,1: registered, elevator, terrace, parking, garage, heating

export const getAndArrangeData = async () => {
  const data = await getData();
  //   console.log(data.length);
  //   console.log(data[0]);
  const avg = await getAvg();
  const newData: Row[] = [];
  //   console.log(avg);
  //   console.log(
  //     "----",
  //     data[0].location,
  //     data[0].location?.split(", ")[1],
  //     data[0].location ? distances[data[0].location.split(", ")[1]] : "]"
  //   );
  data.map((row) => {
    const size = row.size ? +row.size : 1;
    const locationWithoutCity = data[0].location?.split(", ")[1];
    const location = locationWithoutCity ? distances[locationWithoutCity] : 0;
    const price = row.price ? +row.price : 1; //todo avg
    const bathrooms = row.numOfBathrooms ? +row.numOfBathrooms : avg[0].avgBath;
    const rooms = row.numOfRooms ? +row.numOfRooms : 1; //todo avg
    const year = row.yearOfConstruction ?? avg[0].avgYear;

    const newRow: Row = {
      // id: row.id,
      // url: row.url ?? "",
      // title: row.title ?? "",
      price: normalize(price, avg[0].minPrice, avg[0].maxPrice),
      size: normalize(size, avg[0].minSize, avg[0].maxSize),
      location: normalizeLocation(location),
      floor: floorTmp(row.floor, row.totalFloors),
      numOfBathrooms: normalize(bathrooms, avg[0].minBath, avg[0].maxBath),
      numOfRooms: normalize(rooms, avg[0].minRooms, avg[0].maxRooms),
      registered: boolToNumber(row.registered),
      elevator: boolToNumber(row.elevator),
      terrace: boolToNumber(row.terrace),
      parking: boolToNumber(row.parking),
      garage: boolToNumber(row.garage),
      yearOfConstruction: normalize(year, avg[0].minYear, avg[0].maxYear),
    };

    newData.push(newRow);
  });
  console.log(newData[0]);
  return newData;
};

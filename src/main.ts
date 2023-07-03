import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient } from "./db/drizzle.ts";
import { and, eq, isNull, like, or, lt, gt } from "drizzle-orm";
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
import { PgDialect } from "drizzle-orm/pg-core";
import { exit } from "process";
import { cleanUpData } from "./cleanUpData.ts";
import { getAndArrangeData } from "./arrangeData.ts";
import { LinearRegression } from "./linearRegression.ts";

const pgDialect = new PgDialect();

const startUrls = [
  // NE ZABORAVI: PO STRANICI 50!!!!!!
  // NE ZABORAVI FILTER SRBIJA!!!!!
  // na kucama za prodaju ima ih i sa cenom undefined
  // na svim kucama je sa zemljama van srbije
  ////
  /////
  // {
  //   // houses for rent - done
  //   url: "https://www.nekretnine.rs/stambeni-objekti/kuce/izdavanje-prodaja/izdavanje/lista/po-stranici/20/",
  //   label: "propertiesList",
  // },
  // {
  //   // houses for sale - done
  //   url: "https://www.nekretnine.rs/stambeni-objekti/kuce/izdavanje-prodaja/prodaja/lista/po-stranici/20/",
  //   label: "propertiesList",
  // },
  // {
  //   // apartments for rent - done
  //   url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/izdavanje/lista/po-stranici/20/",
  //   label: "propertiesList",
  // },
  // {
  //   // apartments for sale do 100 000 - done
  //   url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/cena/_100000/lista/po-stranici/20/",
  //   label: "propertiesList",
  // },
  // {
  //   // apartments for sale od 100k do 160k - dpne
  //   url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/cena/100000_160000/lista/po-stranici/20/",
  //   label: "propertiesList",
  // },
  // {
  //   // apartments for sale od 160k - done
  //   url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/cena/160000_/lista/po-stranici/20/",
  //   label: "propertiesList",
  // },
  {
    url: "https://www.nekretnine.rs/stambeni-objekti/kuce/adamovicevo-naselje-useljiva-kuca/NkR5eYXTatH/",
    label: "property",
  },
];

const crawler = new CheerioCrawler({
  requestHandler: router,
  maxRequestsPerMinute: 20,
});

// this will automatically run needed migrations on the database
await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" }); //razl

// await crawler.run(startUrls);//Done

// await cleanUpData(); //Done
// const regression = new LinearRegression(0.01, 2);
// const X = [
//   [1, 2],
//   [2, 3],
//   [3, 4],
//   [4, 5],
//   [5, 6],
// ];
// const y = [3, 5, 7, 9, 11];
// regression.train(X, y, 2000);
// console.log(regression.predict([6, 7]));
const regression = new LinearRegression(0.01, 1);
const X = [[1], [2], [3], [4], [5]];
const y = [3, 5, 7, 9, 11];
regression.train(X, y, 1000);
console.log(regression.predict([5]));
exit();

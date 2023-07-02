import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient } from "./db/drizzle.ts";
import { and, eq, isNull, like, or } from "drizzle-orm";
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

const pgDialect = new PgDialect();

const startUrls = [
  // NE ZABORAVI: PO STRANICI 50!!!!!!
  // NE ZABORAVI FILTER SRBIJA!!!!!
  // na kucama za prodaju ima ih i sa cenom undefined
  // na svim kucama je sa zemljama van srbije
  // todo izbaci duplikate
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

await crawler.run(startUrls);

// clean up the data
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

await Promise.all([hrQuery, hsQuery, arQuery, asQuery]);

exit();

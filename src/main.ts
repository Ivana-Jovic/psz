import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient } from "./db/drizzle.ts";

//TODO nije provereno radi li prelazak na novu stranu
const startUrls = [
  // {
  //   url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/cena/1_100000/lista/po-stranici/20/",
  //   label: "propertiesList",
  // },

  //NE ZABORAVI: PO STRANICI 50!!!!!!
  //NE ZABORAVI FILTER SRBIJA!!!!!
  // na kucama za prodaju ima ih i sa cenom undefined
  // na svim kucama je sa zemljama van srbije
  // todo izbaci duplikate

  ////

  // todo posle
  // await crawler.run(startUrls); dodaj ciscenje podataka

  /////
  {
    // houses for rent - done
    url: "https://www.nekretnine.rs/stambeni-objekti/kuce/izdavanje-prodaja/izdavanje/lista/po-stranici/20/",
    label: "propertiesList",
  },
  {
    // houses for sale
    url: "https://www.nekretnine.rs/stambeni-objekti/kuce/izdavanje-prodaja/prodaja/lista/po-stranici/20/",
    label: "propertiesList",
  },
  // {
  //   // https://www.nekretnine.rs/stambeni-objekti/stanovi/undefined/Nk_49ImEdhu/
  //   url: "https://www.nekretnine.rs/stambeni-objekti/kuce/vozdovac-vozdovacka-crkva-kostolacka-207m2-kostolacka/Nk-DfUfFK6M/",
  //   label: "property",
  // },
];

const crawler = new CheerioCrawler({
  requestHandler: router,
  // maxRequestsPerCrawl: 50,
  maxRequestsPerMinute: 20,
});

// this will automatically run needed migrations on the database
await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" }); //razl

await crawler.run(startUrls);

import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient } from "./db/drizzle.ts";

const startUrls = [
  //todo NE ZABORAVI: PO STRANICI 50!!!!!!
  //todo NE ZABORAVI FILTER SRBIJA!!!!!
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
    // houses for sale - done
    url: "https://www.nekretnine.rs/stambeni-objekti/kuce/izdavanje-prodaja/prodaja/lista/po-stranici/20/",
    label: "propertiesList",
  },
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
  // {
  //   url: "https://www.nekretnine.rs/stambeni-objekti/kuce/adamovicevo-naselje-useljiva-kuca/NkR5eYXTatH/",
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

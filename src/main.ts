import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient } from "./db/drizzle.ts";

//TODO nije provereno radi li prelazak na novu stranu
const startUrls = [
  //   {
  //     url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/cena/1_100000/lista/po-stranici/20/",
  //     label: "propertiesList",
  //   },

  {
    // https://www.nekretnine.rs/stambeni-objekti/stanovi/undefined/Nk_49ImEdhu/
    url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/petosoban-stan-sa-garaznim-mestom-vracarski-plato/NkpyXfjXRJ_/",
    label: "property",
  },
];

const crawler = new CheerioCrawler({
  requestHandler: router,
  maxRequestsPerCrawl: 10,
  maxRequestsPerMinute: 20,
});

// this will automatically run needed migrations on the database
await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" }); //razl

await crawler.run(startUrls);

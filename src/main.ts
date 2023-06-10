import { CheerioCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.js";

const startUrls = [
  //   {
  //     url: "https://www.nekretnine.rs/stambeni-objekti/stanovi/izdavanje-prodaja/prodaja/cena/1_100000/lista/po-stranici/20/",
  //     label: "propertiesList",
  //   },

  {
    url: "https://www.nekretnine.rs/stambeni-objekti/kuce/fantasticna-kuca-u-starom-beceju-170m2/Nk7LfKkr7tt/",
    label: "property",
  },
];

const crawler = new CheerioCrawler({
  requestHandler: router,
  maxRequestsPerCrawl: 10,
  maxRequestsPerMinute: 20,
});

await crawler.run(startUrls);

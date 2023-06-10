import { Dataset, createCheerioRouter } from "crawlee";
import { Cheerio, AnyNode, CheerioAPI } from "cheerio";

export const router = createCheerioRouter();

router.addHandler(
  "propertiesList",
  async ({ request, $, log, enqueueLinks }) => {
    const pageTitle = $(".page-title").text().trim();
    const parsedURL = request.url.split("/");
    const pageNumber = request.url.includes("/20/stranica")
      ? parsedURL[parsedURL.length - 2]
      : 1;
    log.info(`Currently on "${pageTitle}" number ${pageNumber}`, {
      url: request.loadedUrl,
    });

    await enqueueLinks({
      label: "property",
      forefront: true,
      selector: ".offer-title",
    });

    await enqueueLinks({
      label: "propertiesList",
      selector: ".next-number",
    });

    const dataset = await Dataset.open("crawled_pages");

    await dataset.pushData({
      url: request.loadedUrl,
      pageTitle,
    });
  }
);

const parseDetails = (details: Cheerio<AnyNode>, $: CheerioAPI) => {
  let detailsMainList: string[] = [];
  details.find("li").each(function () {
    var tmp = $(this)
      .text()
      .trim()
      .replace(/(\n\s*){1,}/g, "")
      .toLowerCase();
    detailsMainList.push(tmp);
  });
  return detailsMainList;
};

const getDetail = (detail: string, detailsList: string[]) => {
  return detailsList.find((elem) => elem.includes(detail))?.split(":")[1];
};

const getDetailNumber = (detail: string, detailsList: string[]) => {
  const str = getDetail(detail, detailsList);
  return str && !isNaN(+str) ? +str : undefined;
};

const stringToNumber = (str: string) => {
  return isNaN(+str) ? undefined : +str;
};

router.addHandler("property", async ({ request, $, log }) => {
  /*
    tip nekretnine
    tip ponude
    title
    lokacija grad i deo grada
    kvadratura
    cena ukupna
    godina izgradnje
    povrsina zemljista (samo za kuce)
    spratnost (ukupna i sprat na kojoj se nalazi, samo za stanove)
    uknjiženost (da/ne)
    tip grejanja
    ukupan broj soba
    ukupan broj kupatila (toaleta)
    podaci o parkingu (da/ne)//
    dodatne informacije (da li ima lift u zgradi, da li ima terasu/lođu/balkon)//
        da li ima lift u zgradi
        da li ima terasu/lođu/balkon
    */

  const detailsChildren = $("#detalji").children(".property__amenities");
  const detailsMain = detailsChildren.first();
  const detailsAdditional =
    detailsMain.next().find("h3").text().trim() === "Dodatna opremljenost"
      ? detailsMain.next()
      : undefined;
  const detailsOther =
    detailsChildren.last().find("h3").text().trim() === "Ostalo"
      ? detailsChildren.last()
      : undefined;

  const detailsMainList = parseDetails(detailsMain, $);
  const detailsAdditionallist = detailsAdditional
    ? parseDetails(detailsAdditional, $)
    : undefined;
  const detailsOtherList = detailsOther
    ? parseDetails(detailsOther, $)
    : undefined;

  const transaction = getDetail("transakcija", detailsMainList);
  const isForRent = transaction ? transaction === "izdavanje" : undefined;

  const category = getDetail("kategorija", detailsMainList);
  const isApartment = category ? category.includes("stan") : undefined;

  const title = $(".detail-title").text().trim();
  const price = stringToNumber(
    $(".stickyBox__price").text().split("EUR")[0].trim().replace(" ", "")
  );
  const size = stringToNumber(
    $(".stickyBox__size").text().trim().split(" ")[0]
  );

  const location = $(".stickyBox__Location").text().trim().toLowerCase();
  const city = location.split(",")[0];

  const yearOfConstruction = getDetailNumber(
    "godina izgradnje",
    detailsMainList
  );

  const landSurface = getDetailNumber("površina zemljišta", detailsMainList);

  const totalFloors = getDetailNumber("ukupan brој spratova", detailsMainList);
  let floor: number | undefined = undefined;
  const tmpFloor = getDetail("spratnost", detailsMainList);
  switch (tmpFloor) {
    case "suteren":
      floor = -1;
      break;
    case "prizemlje":
      floor = 0;
      break;
    case "visoko prizemlje":
      floor = 0;
      break;
    default:
      if (tmpFloor && !isNaN(+tmpFloor)) {
        floor = +tmpFloor;
      }
      break;
  }

  const numOfBathrooms = getDetailNumber("broj kupatila", detailsMainList);
  const numOfRooms = getDetailNumber("ukupan broj soba", detailsMainList);
  const registered =
    getDetail("uknjiženo", detailsMainList) === "da"
      ? true
      : getDetail("uknjiženo", detailsMainList) === "ne"
      ? false
      : undefined;

  const heating = detailsOtherList && getDetail("grejanje", detailsOtherList); // jel ovo vraca str
  const heatingCentral = heating?.includes("centralno grejanje");
  const heatingTA = heating?.includes("ta peć");
  const heatingAirConditioning = heating?.includes("klima uređa");
  const heatingFloor = heating?.includes("centralno grejanje");
  const heatingElectricity = heating?.includes("etažno grejanje na struju");
  const heatingGas = heating?.includes("etažno grejanje na gas");
  const heatingSolidFuel = heating?.includes(
    "etažno grejanje na čvrsto gorivo"
  );
  const heatingOther =
    heating &&
    heating.length > 0 &&
    !heatingCentral &&
    !heatingCentral &&
    !heatingTA &&
    !heatingAirConditioning &&
    !heatingFloor &&
    !heatingElectricity &&
    !heatingGas &&
    !heatingSolidFuel;

  const elevator = !!detailsAdditionallist?.find((elem) =>
    elem.includes("lift")
  );

  const terrace = !!detailsAdditionallist?.find(
    (elem) =>
      elem.includes("terasa") ||
      elem.includes("lođa") ||
      elem.includes("balkon")
  );

  const parking = !!detailsAdditionallist?.find((elem) =>
    elem.includes("spoljno parking mesto")
  );

  const garage = !!detailsAdditionallist?.find(
    (elem) => elem.includes("garaža") || elem.includes("garažno mesto")
  );

  log.info(`Currently on "${title}"`, {
    title,
    price,
    size,
    isForRent,
    isApartment,
    location,
    city,
    yearOfConstruction,
    landSurface,
    floor,
    totalFloors,
    numOfBathrooms,
    numOfRooms,
    registered,
    heating,
    heatingCentral,
    heatingTA,
    heatingAirConditioning,
    heatingFloor,
    heatingElectricity,
    heatingGas,
    heatingSolidFuel,
    heatingOther,
    elevator,
    terrace,
    parking,
    garage,
    url: request.loadedUrl,
  });

  const dataset = await Dataset.open("crawled_properties");

  await dataset.pushData({
    url: request.loadedUrl,
    title,
  });
});

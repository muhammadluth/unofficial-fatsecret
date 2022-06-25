// import cheerio from "cheerio";
// import { VercelResponse, VercelRequest } from "@vercel/node";
// import { fetchHTML } from "../../../utils/fetch";
// import { getLang } from "../../../utils/lang";
// import { ResponseGetList, ResultGetList, OtherServing } from "../../../types/search"

// export default async (request: VercelRequest, response: VercelResponse): Promise<void> => {
//   const host = `${request.headers["x-forwarded-proto"]}://${request.headers["x-forwarded-host"]}`
//   const food: any = request.query.food;
//   const page: any = +request.query.page || 0;
//   const langConfig = getLang(String(request.query.lang));

//   if (!langConfig) {
//     response.
//       status(400).
//       json({ message: `${request.query.lang} are not supported` });
//     return;
//   }

//   if (!food) {
//     response.
//       status(400).
//       json({ message: "Please insert query params" });
//     return;
//   }

//   const html = await fetchHTML(langConfig.searchUrl, {
//     q: food,
//     pg: page,
//   });

//   const $ = cheerio.load(html);
//   const results: ResultGetList[] = [];

//   $("table.generic.searchResult td.borderBottom").each((_, elem: any) => {
//     const element = $(elem);
//     const title = element.find("a.prominent");
//     const titleText = title.text();
//     const linkDetail = title.attr("href");
//     const normalizeText = element
//       .find("div.smallText.greyText.greyLink")
//       .text()
//       .replace(/(\r\n|\n|\r\t|\t|\r)/gm, "");

//     const splitSection = normalizeText.split(langConfig.otherSizes);
//     const splitGeneralInfoString = splitSection[0].split("-");
//     const generalInfo = splitGeneralInfoString[1].split("|");

//     const calories =
//       +generalInfo[0].replace(langConfig.measurementRegex.calories, "") || 0;

//     const fat =
//       +generalInfo[1]
//         .replace(langConfig.measurementRegex.fat, "")
//         .replace(",", ".") || 0;

//     const carbo =
//       +generalInfo[2]
//         .replace(langConfig.measurementRegex.carb, "")
//         .replace(",", ".") || 0;

//     const protein =
//       +generalInfo[3]
//         .replace(langConfig.measurementRegex.protein, "")
//         .replace(",", ".") || 0;

//     // Search other serving method
//     const otherServing: OtherServing[] = [];
//     if (splitSection[1]) {
//       const val = splitSection[1].split(",");
//       val.pop();

//       val.forEach((vl) => {
//         const normalize = vl.split("-");
//         otherServing.push({
//           name: normalize[0] ? normalize[0].trim() : "No Name",
//           calories: normalize[1]
//             ? +normalize[1].replace(langConfig.caloriesPrefix, "")
//             : 0,
//         });
//       });
//     }

//     results.push({
//       title: titleText,
//       protein,
//       fat,
//       carbo,
//       calories,
//       otherServing,
//       serving: splitGeneralInfoString[0]
//         ? splitGeneralInfoString[0].trim()
//         : null,
//       detailLink: `${host}/api/${langConfig.lang}/detail?url=${encodeURIComponent(String(linkDetail))}`,
//     });
//   });

//   const searchSum = $(".searchResultSummary").text().split(" ");
//   const count = parseInt(searchSum[4]);
//   const endOfPage = count === parseInt(searchSum[2]);
//   const startOfPage = page < 1;
//   const next = endOfPage
//     ? null
//     : `${host}/api/${langConfig.lang}/search?food=${food}&page=${parseInt(page) + 1}`;
//   const previous = startOfPage
//     ? null
//     : `${host}/api/${langConfig.lang}/search?food=${food}&page=${parseInt(page) - 1}`;
//   const data: ResponseGetList = {
//     count,
//     next,
//     previous,
//     results,
//   };
//   response.setHeader("Cache-Control", "s-maxage=100, stale-while-revalidate");
//   response.json(data);
// };

// import cheerio from 'cheerio';
// import { ResponseGetList, ResultData } from 'types/global.types';
// import {
//   FatsecretLanguageConfig,
//   QueryGetScrapingFoods,
//   ServingSize,
// } from 'types/fatsecret.types';

// export const DoLoadFoodsData = async (
//   host: string,
//   html: string,
//   fatsecretLang: FatsecretLanguageConfig,
//   queryParams: QueryGetScrapingFoods,
// ) => {
//   const $ = cheerio.load(html);

//   const results: ResultData[] = [];

//   for (var elem of $('table.generic.searchResult td.borderBottom')) {
//     const element = $(elem);
//     const title = element.find('a.prominent');
//     const titleText = title.text();
//     const linkDetail = title.attr('href');

//     // scraping nutritions data
//     const content = element
//       .find('div.smallText.greyText.greyLink')
//       .text()
//       .replace(/(\r\n|\n|\r\t|\t|\r)/gm, '');
//     const splitContentBySection = content.split(fatsecretLang.otherSizes);
//     const splitContentByDash = splitContentBySection[0].split('-');
//     const splitContentByPipe = splitContentByDash[1].split('|');

//     const calorie =
//       +splitContentByPipe[0].replace(
//         fatsecretLang.measurementRegex.calories,
//         '',
//       ) || 0;

//     const fat =
//       +splitContentByPipe[1]
//         .replace(fatsecretLang.measurementRegex.fat, '')
//         .replace(',', '.') || 0;

//     const carbo =
//       +splitContentByPipe[2]
//         .replace(fatsecretLang.measurementRegex.carb, '')
//         .replace(',', '.') || 0;

//     const protein =
//       +splitContentByPipe[3]
//         .replace(fatsecretLang.measurementRegex.protein, '')
//         .replace(',', '.') || 0;

//     // serving size
//     const sevingSize: ServingSize[] = [];
//     if (splitContentBySection[1]) {
//       const splitContentByComma = splitContentBySection[1].split(',');
//       splitContentByComma.pop();

//       splitContentByComma.forEach((item) => {
//         const normalize = item.split('-');
//         if (normalize[0]) {
//           sevingSize.push({
//             name: normalize[0].trim(),
//             calories: normalize[1]
//               ? +normalize[1].replace(fatsecretLang.caloriesPrefix, '')
//               : 0,
//           });
//         }
//       });
//     }

//     results.push({
//       title: titleText,
//       portion: null,
//       photo: null,
//       calorie: calorie,
//       fat: fat,
//       carbo: carbo,
//       protein: protein,
//       cooking_preparation_duration: null,
//       cooking_duration: null,
//       meal_types: null,
//       ingredients: null,
//       serving_sizes: sevingSize,
//       instructions: null,
//     });

//     // results.push({
//     //   title: titleText,
//     //   protein,
//     //   fat,
//     //   carbo,
//     //   calories,
//     //   otherServing,
//     //   serving: splitGeneralInfoString[0]
//     //     ? splitGeneralInfoString[0].trim()
//     //     : null,
//     //   detailLink: `${host}/api/${
//     //     fatsecretLang.lang
//     //   }/detail?url=${encodeURIComponent(String(linkDetail))}`,
//     // });
//   }

//   // set response
//   const { pg } = queryParams;
//   const searchSum = $('.searchResultSummary').text().split(' ');
//   const count = parseInt(searchSum[4]);
//   const next =
//     count === parseInt(searchSum[2]) // endOfPage
//       ? null
//       : host.replace(`page=${pg}`, `page=${pg + 1}`);
//   const previous =
//     pg < 1 // startOfPage
//       ? null
//       : host.replace(`page=${pg}`, `page=${pg - 1}`);
//   const response: ResponseGetList = {
//     count: count,
//     next: next,
//     previous: previous,
//     results: results,
//   };
//   return response;
// };

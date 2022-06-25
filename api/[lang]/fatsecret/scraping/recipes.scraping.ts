import cheerio from "cheerio";
import { fetchHTML } from "../../../../utils/fetch";
import { ResponseGetList, ResultData } from "../../../../types/global.types";
import {
  FatsecretLanguageConfig,
  QueryGetScrapingRecipes,
} from "../../../../types/fatsecret.types";

export const DoScrapingRecipes = async (
  host: string,
  fatsecretLang: FatsecretLanguageConfig,
  queryParams: QueryGetScrapingRecipes
) => {
  const results: ResultData[] = [];
  let searchSum: any = "";
  if (queryParams.limit === "all") {
    for (;;) {
      queryParams.pg = 0;
      const html = await fetchHTML(fatsecretLang.recipeUrl, {
        pa: queryParams.pa,
        recipe: queryParams.recipe,
        pg: queryParams.pg,
      });
      const $ = cheerio.load(html);
      const data: ResultData[] = await doLoadRecipesData($, fatsecretLang);
      results.push(...data);

      searchSum = $(".searchResultSummary").text().split(" ");
      if (results.length === parseInt(searchSum[4])) break;
      queryParams.pg += 1;
    }
  } else {
    const html = await fetchHTML(fatsecretLang.recipeUrl, {
      pa: queryParams.pa,
      recipe: queryParams.recipe,
      pg: queryParams.pg,
    });
    const $ = cheerio.load(html);
    const data: ResultData[] = await doLoadRecipesData($, fatsecretLang);
    results.push(...data);

    searchSum = $(".searchResultSummary").text().split(" ");
  }

  // set response
  const { pg } = queryParams;
  //   const searchSum: any = $('.searchResultSummary').text().split(' ');
  const count = parseInt(searchSum[4]);
  const next =
    count === parseInt(searchSum[2]) // endOfPage
      ? null
      : host.replace(`page=${pg}`, `page=${pg + 1}`);
  const previous =
    pg < 1 // startOfPage
      ? null
      : host.replace(`page=${pg}`, `page=${pg - 1}`);
  const response: ResponseGetList = {
    count: count,
    next: next,
    previous: previous,
    results: results,
  };
  return response;
};

const doLoadRecipesData = async (
  $: cheerio.Root,
  fatsecretLang: FatsecretLanguageConfig
) => {
  const results: ResultData[] = [];
  for (var elem of $("table.listtable.searchResult tr.listrow")) {
    const element = $(elem);
    const title = element.find("a.prominent");
    const detailLink = `${fatsecretLang.baseUrl}${String(title.attr("href"))}`;
    const titleText = title.text().trim();
    const photo = element
      .find("img")
      .attr("src")
      ?.toString()
      .replace(/(_sq)/g, "");

    // scraping nutritions data
    const content = element
      .find("div.smallText")
      .text()
      .replace(/(\r\n|\r\t|\t|\r)/gm, "")
      .replace(/(\n|\n)/gm, "-");
    const sliceContent = content.slice(3, content.length).trim();
    const splitContentByDash = sliceContent.split("-");
    const splitContentByPipe = splitContentByDash[2].split("|");
    const calorie =
      +splitContentByPipe[0].replace(
        fatsecretLang.measurementRegex.calories,
        ""
      ) || 0;
    const fat =
      +splitContentByPipe[1]
        .replace(fatsecretLang.measurementRegex.fat, "")
        .replace(",", ".") || 0;
    const carbo =
      +splitContentByPipe[2]
        .replace(fatsecretLang.measurementRegex.carb, "")
        .replace(",", ".") || 0;
    const protein =
      +splitContentByPipe[3]
        .replace(fatsecretLang.measurementRegex.protein, "")
        .replace(",", ".") || 0;

    // scraping detail data
    const htmlDetail = await fetchHTML(detailLink, {});
    const $Detail = cheerio.load(htmlDetail);
    for (var elemDetail of $Detail("table.generic td.leftCell")) {
      const elementDetail = $Detail(elemDetail);
      const portion = elementDetail.find("div.yield").text();
      const cookingPrepDuration = elementDetail.find("div.prepTime").text();
      const cookingDuration = elementDetail.find("div.cookTime").text();
      const mealTypes: string[] = [];
      elementDetail.find("div.tag").each(function (index, element) {
        mealTypes.push($Detail(element).text());
      });
      const ingredients: string[] = [];
      elementDetail.find("li.ingredient").each(function (index, element) {
        ingredients.push($Detail(element).text());
      });
      const instructions: string[] = [];
      elementDetail.find("li.instruction").each(function (index, element) {
        instructions.push($Detail(element).text());
      });
      results.push({
        title: titleText,
        portion: portion,
        photo: photo ? photo : process.env.STAGING_DEFAULT_FOOD_PHOTO,
        calorie: calorie,
        fat: fat,
        carbo: carbo,
        protein: protein,
        cooking_preparation_duration: cookingPrepDuration,
        cooking_duration: cookingDuration,
        meal_types: mealTypes,
        ingredients: ingredients,
        serving_sizes: null,
        instructions: instructions,
      });
    }
  }
  return results;
};

import fs from "fs"
import path from "path"
import cheerio from "cheerio";
import dayjs from "dayjs"
import { VercelResponse, VercelRequest } from "@vercel/node";
import { fetchHTML } from "../../../utils/fetch";
import { getLang } from "../../../utils/lang";
import { ResponseGetList, ListRecipeData } from "../../../types/recipe"


/*
  id : null
  food_name : title
  food_brand : null
  fat  : fat
  carb : carbo
  calorie : calorie
  protein : protein
  food_photo : photo
  portion : 1
  portion_unit :
  cooking_duration : coocking_duration + cooking_prep_duration
  recipe_id : 0
  ingredients : ingredients
  meal_type : mealTypes
  serving_size : ingredients
  food_size : null
  user_id : null
*/

export default async (request: VercelRequest, response: VercelResponse): Promise<void> => {
  const tempDir: string = "temp"
  const tempFile: string = path.join("temp", `[${dayjs().format("YYYY-MM-DD")}]-recipe.json`)
  const tempFileIsExists: boolean = fs.existsSync(tempFile) || false
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const host = `${request.headers["x-forwarded-proto"]}://${request.headers["x-forwarded-host"]}`
  const search: any = request.query.search;
  const cron: any = request.query.cron || false;
  let page: any = +request.query.page || 0;
  const langConfig = getLang(String(request.query.lang));

  if (!langConfig) {
    response.
      status(400).
      json({ message: `${request.query.lang} are not supported` });
    return;
  }

  if (!search && !cron) {
    response.
      status(400).
      json({ message: "Please insert query params" });
    return;
  }

  const results: ListRecipeData[] = []

  let responseGetList: object = {};
  if (cron) {
    let searchSum: any = ""
    for (; ;) {
      const html = await fetchHTML(langConfig.recipeUrl, {
        pa: "rs",
        recipe: search,
        pg: page,
      });
      const $ = cheerio.load(html);
      const data: ListRecipeData[] = await DoLoadData($, langConfig)
      results.push(...data)

      searchSum = $(".searchResultSummary").text().split(" ");
      if (results.length === parseInt(searchSum[4])) break;
      page += 1
    }

    // set response
    const count = parseInt(searchSum[4]);
    const next = count === parseInt(searchSum[2]) // endOfPage
      ? null
      : `${host}/api/${langConfig.lang}/search?search=${search}&page=${parseInt(page) + 1}`;
    const previous = page < 1 // startOfPage
      ? null
      : `${host}/api/${langConfig.lang}/search?search=${search}&page=${parseInt(page) - 1}`;
    responseGetList = {
      count: count,
      next: next,
      previous: previous,
      results: results,
    };
  } else if (!cron && tempFileIsExists) {
    const data: any = fs.readFileSync(tempFile)
    const JSONParse = JSON.parse(data)
    const filterData = JSONParse.results.filter((item) => item.title.includes(search))
    responseGetList = {
      count: filterData.length,
      next: JSONParse.next,
      previous: JSONParse.previous,
      results: filterData,
    };
  } else if (!cron && !tempFileIsExists) {
    const html = await fetchHTML(langConfig.recipeUrl, {
      pa: "rs",
      recipe: search,
      pg: page,
    });
    const $ = cheerio.load(html);
    const data: ListRecipeData[] = await DoLoadData($, langConfig)
    results.push(...data)

    // set response
    const searchSum: any = $(".searchResultSummary").text().split(" ");
    const count = parseInt(searchSum[4]);
    const next = count === parseInt(searchSum[2]) // endOfPage
      ? null
      : `${host}/api/${langConfig.lang}/search?search=${search}&page=${parseInt(page) + 1}`;
    const previous = page < 1 // startOfPage
      ? null
      : `${host}/api/${langConfig.lang}/search?search=${search}&page=${parseInt(page) - 1}`;
    responseGetList = {
      count: count,
      next: next,
      previous: previous,
      results: results,
    };
  }


  if (cron) {
    fs.writeFile(tempFile,
      JSON.stringify(responseGetList, null, 4), function (err) {
        err ? console.log("error create file")
          : console.log('File is created successfully.')
      });
  }
  response.setHeader("Cache-Control", "s-maxage=100, stale-while-revalidate");
  response.json(responseGetList);
};

async function DoLoadData($: cheerio.Root, langConfig: any) {
  const data: ListRecipeData[] = [];
  for (var elem of $("table.listtable.searchResult tr.listrow")) {
    const element = $(elem);
    const title = element.find("a.prominent");
    const detailLink = path.join(langConfig.baseUrl, String(title.attr("href")))
    const titleText = title.text().trim();
    const photo = element.find('img').attr('src');

    // scraping nutritions data
    const recipeContent = element.find("div.smallText").text().replace(/(\r\n|\r\t|\t|\r)/gm, "").replace(/(\n|\n)/gm, "-")
    const sliceRecipeContent = recipeContent.slice(3, recipeContent.length).trim()
    const splitRecipeContentByDash = sliceRecipeContent.split("-");
    const splitRecipeContentByPipe = splitRecipeContentByDash[2].split("|");
    const calorie = +splitRecipeContentByPipe[0].replace(langConfig.measurementRegex.calories, "") || 0;
    const fat = +splitRecipeContentByPipe[1].replace(langConfig.measurementRegex.fat, "").replace(",", ".") || 0;
    const carbo = +splitRecipeContentByPipe[2].replace(langConfig.measurementRegex.carb, "").replace(",", ".") || 0;
    const protein = +splitRecipeContentByPipe[3].replace(langConfig.measurementRegex.protein, "").replace(",", ".") || 0;

    // scraping detail data
    const htmlDetail = await fetchHTML(detailLink, {});
    const $Detail = cheerio.load(htmlDetail);
    $Detail("table.generic td.leftCell").each((_, elemDetail: any) => {
      const elementDetail = $Detail(elemDetail);
      const portion = elementDetail.find("div.yield").text()
      const cookingPrepDuration = elementDetail.find("div.prepTime").text()
      const cookingDuration = elementDetail.find("div.cookTime").text()
      const mealTypes: string[] = []
      elementDetail.find("div.tag").each(function (index, element) {
        mealTypes.push($Detail(element).text());
      });
      const ingredients: string[] = []
      elementDetail.find("li.ingredient").each(function (index, element) {
        ingredients.push($Detail(element).text());
      });
      const instructions: string[] = []
      elementDetail.find("li.instruction").each(function (index, element) {
        instructions.push($Detail(element).text());
      });
      data.push({
        title: titleText,
        portion: portion,
        photo: photo ? photo : null,
        calorie: calorie,
        fat: fat,
        carbo: carbo,
        protein: protein,
        cooking_preparation_duration: cookingPrepDuration,
        cooking_duration: cookingDuration,
        meal_types: mealTypes,
        ingredients: ingredients,
        instructions: instructions,
      })
    })
  };
  return data
}
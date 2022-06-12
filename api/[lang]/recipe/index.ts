import path from "path"
import fs from "fs"
import cheerio from "cheerio";
import { VercelResponse, VercelRequest } from "@vercel/node";
import { fetchHTML } from "../../../utils/fetch";
import { getLang } from "../../../utils/lang";
import { ResponseGetList, ResultGetList, GetListData } from "../../../types/recipe"


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
  const host = `${request.headers["x-forwarded-proto"]}://${request.headers["x-forwarded-host"]}`
  const search: any = request.query.search;
  const page: any = request.query.page || 0;
  const langConfig = getLang(String(request.query.lang));

  console.log(search, page)

  if (!langConfig) {
    response.
      status(400).
      json({ message: `${request.query.lang} are not supported` });
    return;
  }

  if (!search) {
    response.
      status(400).
      json({ message: "Please insert query params" });
    return;
  }

  const html = await fetchHTML(langConfig.recipeUrl, {
    pa: "rs",
    recipe: search,
    pg: page,
  });

  const $ = cheerio.load(html);

  const results: ResultGetList[] = [];

  for (var item of DoLoadList($, langConfig)) {
    // scraping detail data
    const htmlDetail = await fetchHTML(item.detailLink, {});
    const $Detail = cheerio.load(htmlDetail);
    $Detail("table.generic td.leftCell td.center").each((_, elemDetail: any) => {
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
      results.push({
        title: item.title,
        portion: portion,
        photo: item.photo,
        calorie: item.calorie,
        fat: item.fat,
        carbo: item.carbo,
        protein: item.protein,
        cooking_preparation_duration: cookingPrepDuration,
        cooking_duration: cookingDuration,
        meal_types: mealTypes,
        ingredients: ingredients,
        instructions: instructions,
      })
    })
  }

  const searchSum = $(".searchResultSummary").text().split(" ");
  const count = parseInt(searchSum[4]);
  const endOfPage = count === parseInt(searchSum[2]);
  const startOfPage = page < 1;
  const next = endOfPage
    ? null
    : `${host}/api/${langConfig.lang}/search?search=${search}&page=${parseInt(page) + 1}`;
  const previous = startOfPage
    ? null
    : `${host}/api/${langConfig.lang}/search?search=${search}&page=${parseInt(page) - 1}`;
  const data: ResponseGetList = {
    count,
    next,
    previous,
    results,
  };
  response.setHeader("Cache-Control", "s-maxage=100, stale-while-revalidate");
  response.json(data);
};

function DoLoadList($: cheerio.Root, langConfig: any) {
  const data: GetListData[] = [];
  $("table.listtable.searchResult tr.listrow").each((_, elem: any) => {
    const element = $(elem);
    const title = element.find("a.prominent");
    const detailLink = path.join(langConfig.baseUrl, String(title.attr("href")))
    const titleText = title.text().trim();
    const image = element.find('img').attr('src');

    // scraping nutritions data
    const recipeContent = element.find("div.smallText").text().replace(/(\r\n|\r\t|\t|\r)/gm, "").replace(/(\n|\n)/gm, "-")
    const sliceRecipeContent = recipeContent.slice(3, recipeContent.length).trim()
    const splitRecipeContentByDash = sliceRecipeContent.split("-");
    const splitRecipeContentByPipe = splitRecipeContentByDash[2].split("|");
    const calorie = +splitRecipeContentByPipe[0].replace(langConfig.measurementRegex.calories, "") || 0;
    const fat = +splitRecipeContentByPipe[1].replace(langConfig.measurementRegex.fat, "").replace(",", ".") || 0;
    const carbo = +splitRecipeContentByPipe[2].replace(langConfig.measurementRegex.carb, "").replace(",", ".") || 0;
    const protein = +splitRecipeContentByPipe[3].replace(langConfig.measurementRegex.protein, "").replace(",", ".") || 0;

    data.push({
      title: titleText,
      protein: protein,
      fat: fat,
      carbo: carbo,
      calorie: calorie,
      photo: image ? image : null,
      detailLink: detailLink,
    });
  });
  return data
}
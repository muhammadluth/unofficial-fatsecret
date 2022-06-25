import { VercelResponse, VercelRequest } from "@vercel/node";
import { getFatsecretLang } from "../../../utils/lang";
import { QueryGetScrapingRecipes } from "../../../types/fatsecret.types";
import { DoScrapingRecipes } from "./scraping/recipes.scraping";

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  // const tempFile: string = path.join(
  //   String(tmpdir),
  //   `[${dayjs().format("YYYY-MM-DD")}]-recipe.json`
  // );
  // const tempFileIsExists: boolean = fs.existsSync(tempFile) || false;

  const host = `${request.headers["x-forwarded-proto"]}://${request.headers["x-forwarded-host"]}`;
  const queryPage: number = Number(request.query?.page) || 0;
  const queryRecipeName: string = String(request.query?.["recipe-name"]) || "";
  const queryLimit: string = String(request.query?.limit) || "";
  const fatsecretLang = getFatsecretLang(String(request.query?.lang));

  const queryFatsecret: QueryGetScrapingRecipes = {
    pa: "rs",
    pg: queryPage,
    recipe: queryRecipeName,
    limit: queryLimit,
  };

  if (!fatsecretLang) {
    response
      .status(400)
      .json({ message: `${request.query.lang} are not supported` });
    return;
  }

  const responseGetList = await DoScrapingRecipes(
    host,
    fatsecretLang,
    queryFatsecret
  );

  response.setHeader("Cache-Control", "s-maxage=100, stale-while-revalidate");
  response.json(responseGetList);
};

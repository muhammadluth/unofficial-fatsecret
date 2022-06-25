import { VercelResponse, VercelRequest } from "@vercel/node";
import { fatsecretLang } from "../utils/lang";

export default async (
  _request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  response.json({
    supported_lang: fatsecretLang.map((l) => ({
      lang: l.lang,
      url: l.foodMenuUrl,
    })),
    respository: "https://github.com/muhammadluth/unofficial-fatsecret",
    credits: ["fatsecret.com", "vercel.sh"],
  });
};

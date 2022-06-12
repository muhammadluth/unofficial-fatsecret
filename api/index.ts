import { VercelResponse, VercelRequest } from "@vercel/node";
import { languanges } from "../utils/lang";

export default async (_request: VercelRequest, response: VercelResponse): Promise<void> => {
  response.json({
    supported_lang: languanges.map((l) => ({
      lang: l.lang,
      url: l.searchUrl,
    })),
    respository: "https://github.com/muhammadluth/unofficial-fatsecret",
    credits: ["fatsecret.com", "vercel.sh"],
  });
};

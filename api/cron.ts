import path from "path"
import fs from "fs"
import cheerio from "cheerio";
import { VercelResponse, VercelRequest } from "@vercel/node";

export default async (request: VercelRequest, response: VercelResponse): Promise<void> => {
    let page: any = request.query.page || 0;

    for (; ;) {
        if (page === 10) break;
        page += 1
        console.log(page)
    }

    response.json({
        message: "success"
    })
}
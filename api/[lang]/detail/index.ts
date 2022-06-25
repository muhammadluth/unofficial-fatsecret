// import path from "path"
// import cheerio from "cheerio"
// import { VercelRequest, VercelResponse } from '@vercel/node'
// import { fetchHTML } from "../../../utils/fetch";
// import { getLang } from '../../../utils/lang'

// export default async (request: VercelRequest, response: VercelResponse): Promise<void> => {
//   const host = `${request.headers["x-forwarded-proto"]}://${request.headers["x-forwarded-host"]}`
//   const detailUrl = request.query.url
//   const langConfig = getLang(String(request.query.lang));

//   if (!detailUrl) {
//     response.json({ error: 'Please provide detailLink on search'})
//     return
//   }

//   if (!langConfig) {
//     response.json({ error: `${request.query.lang} are not supported` })
//     return
//   }

//   const html = await fetchHTML(path.join(langConfig.baseUrl, String(detailUrl)), {});

//   const $ = cheerio.load(html);

//   response.json({
//     status: 'work in progress',
//     debug: `${langConfig.baseUrl}${detailUrl}`
//   })
// }

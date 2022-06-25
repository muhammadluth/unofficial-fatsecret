import got from "got";
import qs from "qs";
import path from "path";

const headers = {
  "cache-control": "no-cache",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
};

function generateParams(options: object): string {
  const params = qs.stringify(options, {
    arrayFormat: "brackets",
    encode: false,
  });
  return params;
}

export async function fetchHTML(uri: String, params: object): Promise<string> {
  const url = path.join(String(uri), `?${generateParams(params)}`);
  const response = await got.get(url, { headers, responseType: "text" });
  return response.body;
}

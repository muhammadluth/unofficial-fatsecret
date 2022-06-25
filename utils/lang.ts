import { FatsecretLanguageConfig } from "../types/fatsecret.types";

export const fatsecretLang: FatsecretLanguageConfig[] = [
  {
    lang: "en",
    baseUrl: "https://www.fatsecret.com",
    foodMenuUrl: "https://www.fatsecret.com/calories-nutrition",
    foodUrl: "https://www.fatsecret.com/calories-nutrition/search",
    recipeUrl: "https://www.fatsecret.com/Default.aspx",
    otherSizes: "Other sizes:",
    caloriesPrefix: "kcal",
    measurementRegex: {
      carb: /Carbs:|g/g,
      protein: /Protein:|g/g,
      fat: /Fat:|g/g,
      calories: /Calories:|kcal/g,
    },
  },
  {
    lang: "id",
    baseUrl: "https://www.fatsecret.co.id",
    foodMenuUrl: "https://www.fatsecret.co.id/kalori-gizi",
    foodUrl: "https://www.fatsecret.co.id/kalori-gizi/search",
    recipeUrl: "https://www.fatsecret.co.id/Default.aspx",
    otherSizes: "Ukuran Lainnya:",
    caloriesPrefix: "kkal",
    measurementRegex: {
      carb: /Karb:|g/g,
      protein: /Prot:|g/g,
      fat: /Lemak:|g/g,
      calories: /Kalori:|kkal/g,
    },
  },
];

export function getFatsecretLang(
  paramsLang: string
): FatsecretLanguageConfig | null {
  const currentLang = fatsecretLang.filter(
    (filter) => filter.lang === paramsLang
  )[0];
  return currentLang || null;
}

export interface FatsecretLanguageConfig {
  lang: string;
  baseUrl: string;
  foodMenuUrl: string;
  foodUrl: string;
  recipeUrl: string;
  otherSizes: string;
  caloriesPrefix: string;
  measurementRegex: {
    carb: RegExp;
    protein: RegExp;
    fat: RegExp;
    calories: RegExp;
  };
}

export interface FatsecretData {
  title: string;
  photo: string | null;
  portion: string | null;
  calorie: number | null;
  fat: number | null;
  carbo: number | null;
  protein: number | null;
  cooking_preparation_duration: string | null;
  cooking_duration: string | null;
  meal_types: string[] | null;
  ingredients: string[] | null;
  instructions: string[] | null;
}

export class GetScrapingRecipes {
  params: ParamsGetScraping;
  query: QueryGetScrapingRecipes;
}

class ParamsGetScraping {
  lang: string;
}

export interface QueryGetScrapingRecipes {
  pa: string;
  pg: number;
  recipe: string;
  limit: string;
}

export interface QueryGetScrapingFoods {
  q: string;
  pg: number;
}

export interface ServingSize {
  name: string;
  calories: number;
}

import { ServingSize } from "../types/fatsecret.types";

export interface ResponseGetList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResultData[] | [];
}

export interface ResultData {
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
  serving_sizes: ServingSize[] | null;
  instructions: string[] | null;
}

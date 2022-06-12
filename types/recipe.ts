export interface ResponseGetList {
    count: number;
    next: string | null;
    previous: string | null;
    results: ResultGetList[];
}

export interface ResultGetList {
    title: string;
    photo: string | null;
    portion: string | null;
    calorie: number | null;
    fat: number | null;
    carbo: number | null;
    protein: number | null;
    cooking_preparation_duration: string | null;
    cooking_duration: string | null,
    meal_types: string[] | null;
    ingredients: string[] | null;
    instructions: string[] | null;
}

export interface GetListData {
    title: string;
    detailLink: string;
    calorie: number | null;
    fat: number | null;
    carbo: number | null;
    protein: number | null;
    photo: string | null;
}
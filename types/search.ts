export interface ResponseGetList {
    count: number;
    next: string | null;
    previous: string | null;
    results: ResultGetList[];
}

export interface ResultGetList {
    title: string;
    serving: string | null;
    otherServing: OtherServing[];
    calories: number | null;
    fat: number | null;
    carbo: number | null;
    protein: number | null;
    detailLink: string;
}


export interface OtherServing {
    name: string;
    calories: number;
}
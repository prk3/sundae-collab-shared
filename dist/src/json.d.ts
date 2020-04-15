export declare type JsonData = string | number | boolean | null | JsonData[] | {
    [key: string]: JsonData | undefined;
};
export declare type JsonObject = {
    [key: string]: JsonData | undefined;
};
export declare type JsonArray = JsonData[];
/**
 * Ensures T is JSON data or else the compiler throws an error.
 */
export declare type ForceJson<T> = T extends JsonData ? T : never;

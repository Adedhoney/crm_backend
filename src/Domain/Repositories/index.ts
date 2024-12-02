export * from './AccountRepository';

export interface BasePaginationResponse {
    [key: string]: any;
    page: number;
    limit: number;
    nextPage: number | null;
    prevPage: number | null;
    totalPages: number;
    returnedData: number;
    totalData: number;
}

export type PaginationResponse<
    T,
    K extends keyof any,
> = BasePaginationResponse & {
    [P in K]: T[];
};

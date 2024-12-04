export * from './AccountRepository';
export * from './ClientRepository';
export * from './ContactRepository';
export * from './OTPRepository';
export * from './ReportRepository';

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

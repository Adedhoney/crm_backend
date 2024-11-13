export interface User {
    id?: number;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    DOB?: string;
    status: UserAccountStatus;
    password?: string;
    emailVerified: boolean;
    createdOn?: number;
    lastModifiedOn?: number;
    createdBy?: string;
    modifiedBy?: string;
}

export enum UserAccountStatus {
    ACTIVE = 0,
    BANNED = 1,
}

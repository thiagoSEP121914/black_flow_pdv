// src/core/types.ts
export type UserContext = {
    userId: string;
    companyId: string;
    role: string;
    permissions?: string[];
};

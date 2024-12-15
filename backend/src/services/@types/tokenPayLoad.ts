import { UserRole } from "./user.dto";

export interface TokenPayload {
    id: number;
    email?: string;
    username: string;
    role: UserRole;
}


export interface TokenDecoded {
    id: number;
    iat: number;
    exp: number;
}

export interface JwtTokens {
    refreshToken: string;
    accessToken: string;
}
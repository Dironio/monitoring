import { JwtTokens } from './tokenPayload';

export interface User {
    id: number;
    analyst_id: number;
    seller_id: number;
    web_id: number;

    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    role_id: number;

    // img: string;
    // age: number;
    // gender: string;
    // birthday: Date;

    created_at: Date;
    updated_at: Date;
}

export interface CreateUserDto {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role_id?: number;
    role?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface GetUserDto {
    id?: number;
    analyst_id?: number;
    seller_id?: number;
    web_id?: number;
    username?: string;
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    role_id?: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface UpdateUserDto {
    id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role_id?: number;
    created_at?: Date;
    updated_at?: Date;
}


export interface CreateUserDb {
    username: string
    password: string
}

export interface LoginUserDto {
    username: string
    password: string
}

export interface CreatedUser {
    user: User;
    tokens: JwtTokens;
}



export interface Role {
    id: number;
    role: string;
}

export type UserRole = 1 | 2 | 3 | 4;
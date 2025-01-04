export interface User {
    id: number;
    analyst_id: number;
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    seller_id: number;
    role_id: number;
    role: string;
    web_id: number;
    created_at: Date;
    updated_at: Date;
}
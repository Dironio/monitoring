export interface Application {
    id: number;
    user_id: number;
    type_id: number;
    email: string;
    site_url: string;
    inn: number;
    brand: string;
}

export interface CreateApplicationDto { }

export interface UpdateApplicationDto { }

export interface GetApplicationDto { }
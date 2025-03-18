export interface WebSite {
    id: number;
    site: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateSiteDto {
    site: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UpdateSiteDto {
    id: number;
    site?: string;
    created_at?: Date;
    updated_at?: Date;
}
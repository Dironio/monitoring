export interface CreateSiteDao {
    site: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UpdateSiteDao {
    id: number;
    site?: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface WebSite {
    id: number;
    site: string;
    created_at: Date;
    updated_at: Date;
}

export interface SelectedSite {
    value: number;
    label: string;
}

export interface SiteOption {
    // id: number;
    // name: string;
    // url?: string;
    value: number;
    label: string;
}

export interface PageOption {
    // id: number;
    // name: string;
    // url: string;
    // path: string;

    value: string;
    label: string;
    fullUrl: string;
    path: string;
}
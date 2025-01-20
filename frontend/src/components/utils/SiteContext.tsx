import { createContext, useContext } from 'react';

interface SiteContextType {
    selectedSite: { value: number; label: string } | null;
    selectedPage: { value: string; label: string } | null;
    setSelectedSite: (site: { value: number; label: string } | null) => void;
    setSelectedPage: (page: { value: string; label: string } | null) => void;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteContext must be used within a SiteProvider');
    }
    return context;
};
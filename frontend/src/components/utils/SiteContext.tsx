import { createContext, useContext } from 'react';
import { PageOption } from '../UI/PageSelector';

interface SiteContextType {
    selectedSite: { value: number; label: string } | null;
    selectedPage: PageOption | null;
    setSelectedSite: (site: { value: number; label: string } | null) => void;
    setSelectedPage: (page: PageOption | null) => void;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteContext must be used within a SiteProvider');
    }
    return context;
};
import { createContext, useContext } from 'react';
import { PageOption } from '../UI/PageSelector';
import { SiteOption } from '../../models/site.model';

// interface SiteContextType {
//     selectedSite: { value: number; label: string } | null;
//     selectedPage?: PageOption | null;
//     setSelectedSite: (site: { value: number; label: string } | null) => void;
//     setSelectedPage?: (page: PageOption | null) => void;
// }

// export const SiteContext = createContext<SiteContextType | undefined>(undefined);

// export const useSiteContext = () => {
//     const context = useContext(SiteContext);
//     if (!context) {
//         throw new Error('useSiteContext must be used within a SiteProvider');
//     }
//     return context;
// };





// interface SiteContextType {
//     selectedSite?: SiteOption | null;
//     selectedPage?: PageOption | null;
//     selectedSurvey?: number | null;
//     setSelectedSite?: (site: SiteOption | null) => void;
//     setSelectedPage?: (page: PageOption | null) => void;
//     setSelectedSurvey?: (surveyId: number | null) => void;
// }


interface SiteContextType {
    selectedSite: SiteOption | null;
    selectedPage?: PageOption | null;
    selectedSurvey?: number | null;
    setSelectedSite: (site: SiteOption | null) => void;
    setSelectedPage?: (page: PageOption | null) => void;
    setSelectedSurvey?: (surveyId: number | null) => void;
}

export const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
    const context = useContext(SiteContext);
    if (!context) {
        throw new Error('useSiteContext must be used within a SiteProvider');
    }
    return context;
};
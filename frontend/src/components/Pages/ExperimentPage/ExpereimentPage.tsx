import './ExpereimentPage.css';
import { User } from "../../../models/user.model";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ChipsNavigation, { NavItem } from '../../UI/ChipsNavigation';
import { useEffect, useState } from 'react';
import SiteSelection from '../../UI/SiteSelection';
import { SiteContext } from '../../utils/SiteContext';
import ExperimentFilters from './Components/utils/ExperimentFilters';
import { SiteOption } from '../../../models/site.model';


interface ExperiementPageProps {
    user: User | null;
    loading: boolean;
}

const ExperiementPage: React.FC<ExperiementPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // const [selectedSite, setSelectedSite] = useState<{ value: number; label: string } | null>(() => {
    //     const savedSite = localStorage.getItem('selectedSite');
    //     return savedSite ? JSON.parse(savedSite) : null;
    // });


    const [selectedSite, setSelectedSite] = useState<SiteOption | null>(() => {
        const savedSite = localStorage.getItem('selectedSite');
        return savedSite ? JSON.parse(savedSite) : null;
    });
    const [selectedPage, setSelectedPage] = useState<number | null>(() => {
        const saved = localStorage.getItem('selectedPage');
        return saved ? JSON.parse(saved).value : null;
    });
    const [selectedSurvey, setSelectedSurvey] = useState<number | null>(() => {
        const saved = localStorage.getItem('selectedSurvey');
        return saved ? JSON.parse(saved).value : null;
    });


    const navigationItems: NavItem[] = [
        {
            path: 'surveys',
            label: 'Опросы'
        },
    ];

    useEffect(() => {
        if (location.pathname === '/experiments') {
            navigate('surveys');
        }
    }, [location.pathname, navigate]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const currentPath = location.pathname.split('/').pop() || '';

    return (
        <SiteContext.Provider
            value={{
                selectedSite,
                setSelectedSite,
                selectedSurvey,
                setSelectedSurvey
            }}
        >
            {/* <SiteContext.Provider
            value={{ selectedSite, setSelectedSite }}
        > */}
            <main className="main-page">
                <div className="wrapper-page">
                    <ChipsNavigation
                        items={navigationItems}
                        onNavigate={handleNavigation}
                        currentPath={currentPath}
                        className="metrics-nav"
                        breakpoints={{
                            mobile: 480,
                            tablet: 768,
                            laptop: 1024,
                            desktop: 1280,
                        }}
                        visibleItems={{
                            mobile: 2,
                            tablet: 3,
                            laptop: 4,
                            desktop: 4,
                        }}
                    />

                    {/* <SiteSelection user={user} loading={loading} /> */}
                    <ExperimentFilters user={user} disabled={loading} />

                    <section className="content">
                        <Outlet />
                    </section>
                </div>
            </main>
        </SiteContext.Provider>
    );
}

export default ExperiementPage;
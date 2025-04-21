import './InterfacePage.css';
import { User } from '../../../models/user.model';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SiteSelection from '../../UI/SiteSelection';
import ChipsNavigation, { NavItem } from '../../UI/ChipsNavigation';
import PageSelector, { PageOption } from '../../UI/PageSelector';
import { SiteContext } from '../../utils/SiteContext';
import { SiteOption } from '../../../models/site.model';

interface InterfacePageProps {
    user: User | null;
    loading: boolean;
}

const InterfacePage: React.FC<InterfacePageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();






    const [selectedSite, setSelectedSite] = useState<SiteOption | null>(() => {
        const savedSite = localStorage.getItem('selectedSite');
        return savedSite ? JSON.parse(savedSite) : null;
    });

    const [selectedPage, setSelectedPage] = useState<PageOption | null>(() => {
        const savedPage = localStorage.getItem('selectedPage');
        return savedPage ? JSON.parse(savedPage) : null;
    });

    const [selectedSurvey, setSelectedSurvey] = useState<number | null>(null);






    //Поменять
    const navigationItems: NavItem[] = [
        {
            path: 'heatmap-page',
            label: 'Тепловая карта'
        },
        {
            path: 'heatmap-scroll',
            label: 'Карта скроллов'
        },
        {
            path: 'interaction-analytics',
            label: 'Популярные элементы'
        },
        // { path: 'nav-road', label: 'Навигационные пути' }
    ];

    useEffect(() => {
        if (location.pathname === '/interface') {
            navigate('heatmap-page');
        }
    }, [location.pathname, navigate]);

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const currentPath = location.pathname.split('/').pop() || '';


    // const [selectedSite, setSelectedSite] = useState<{ value: number; label: string } | null>(null);

    // Обработчик события выбора сайта
    const handleSiteSelect = (site: { value: number; label: string } | null) => {
        setSelectedSite(site);
    };

    useEffect(() => {
        if (selectedPage) {
            localStorage.setItem('selectedPage', JSON.stringify(selectedPage));
        } else {
            localStorage.removeItem('selectedPage');
        }
    }, [selectedPage]);











    

    return (
        <SiteContext.Provider
            value={{
                selectedSite,
                selectedPage,
                selectedSurvey,
                setSelectedSite,
                setSelectedPage,
                setSelectedSurvey
            }}
        >
            {/* <SiteContext.Provider value={{ selectedSite, selectedPage, setSelectedSite, setSelectedPage }}> */}
            <main className="main-page">
                <div className="wrapper-page">
                    <ChipsNavigation
                        items={navigationItems}
                        onNavigate={handleNavigation}
                        currentPath={currentPath}
                        // className="interface-nav"
                        breakpoints={{
                            mobile: 480,
                            tablet: 768,
                            laptop: 1024,
                            desktop: 1280,
                        }}
                        visibleItems={{
                            mobile: 1,
                            tablet: 2,
                            laptop: 3,
                            desktop: 4,
                        }}
                    />

                    <nav className="chips-selection">
                        <SiteSelection
                            user={user}
                            loading={loading}
                            onSiteChange={(site) => {
                                setSelectedSite(site);
                                setSelectedPage(null);
                            }}
                        />

                        {/* <PageSelector selectedSite={selectedSite} /> */}

                        <PageSelector
                            selectedSite={selectedSite}
                            selectedPage={selectedPage}
                            onPageChange={(page: PageOption | null) => {
                                setSelectedPage(page);
                            }}
                        />
                    </nav>

                    <section className="content">
                        <Outlet />
                    </section>
                </div>
            </main>
        </SiteContext.Provider >
    );
};

export default InterfacePage;
import './InterfacePage.css';
import { User } from '../../../models/user.model';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SiteSelection from '../../UI/SiteSelection';
import ChipsNavigation, { NavItem } from '../../UI/ChipsNavigation';
import PageSelector from '../../UI/PageSelector';
import { SiteContext } from '../../utils/SiteContext';

interface InterfacePageProps {
    user: User | null;
    loading: boolean;
}

const InterfacePage: React.FC<InterfacePageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();
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
        { path: 'hype-elements', label: 'Популярные элементы' },
        { path: 'nav-road', label: 'Навигационные пути' }
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




    const [selectedSite, setSelectedSite] = useState<{ value: number; label: string } | null>(() => {
        const savedSite = localStorage.getItem('selectedSite');
        return savedSite ? JSON.parse(savedSite) : null;
    });

    const [selectedPage, setSelectedPage] = useState<{ value: string; label: string } | null>(() => {
        const savedPage = localStorage.getItem('selectedPage');
        return savedPage ? JSON.parse(savedPage) : null;
    });

    return (
        <SiteContext.Provider value={{ selectedSite, selectedPage, setSelectedSite, setSelectedPage }}>
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
                            laptop: 2,
                            desktop: 2,
                        }}
                    />

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
                        onPageChange={(page: { value: string; label: string } | null) => {
                            setSelectedPage(page);
                        }}
                    />

                    <section className="content">
                        <Outlet />
                    </section>
                </div>
            </main>
        </SiteContext.Provider>
    );
};

export default InterfacePage;
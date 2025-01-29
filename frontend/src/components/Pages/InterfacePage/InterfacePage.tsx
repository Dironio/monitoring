import './InterfacePage.css';
import { User } from '../../../models/user.model';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SiteSelection from '../../UI/SiteSelection';
import ChipsNavigation, { NavItem } from '../../UI/ChipsNavigation';
import PageSelector, { PageOption } from '../../UI/PageSelector';
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
        {
            path: 'hype-elements',
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




    const [selectedSite, setSelectedSite] = useState<{ value: number; label: string } | null>(() => {
        const savedSite = localStorage.getItem('selectedSite');
        return savedSite ? JSON.parse(savedSite) : null;
    });

    const [selectedPage, setSelectedPage] = useState<PageOption | null>(() => {
        const savedPage = localStorage.getItem('selectedPage');
        if (savedPage) {
            const parsed = JSON.parse(savedPage);
            return {
                value: parsed.value,
                label: parsed.label,
                fullUrl: parsed.value,
                path: parsed.value.replace(/^https?:\/\/[^\/]+(:\d+)?/, '')
            };
        }
        return null;
    });

    useEffect(() => {
        if (selectedPage) {
            localStorage.setItem('selectedPage', JSON.stringify(selectedPage));
        } else {
            localStorage.removeItem('selectedPage');
        }
    }, [selectedPage]);

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
        </SiteContext.Provider>
    );
};

export default InterfacePage;
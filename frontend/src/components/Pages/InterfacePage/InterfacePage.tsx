import './InterfacePage.css';
import { User } from '../../../models/user.model';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import SiteSelection from '../../UI/SiteSelection';
import ChipsNavigation, { NavItem } from '../../UI/ChipsNavigation';

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

    return (
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

                <SiteSelection user={user} loading={loading} />

                <section className="content">
                    <Outlet />
                </section>
            </div>
        </main>
    );
};

export default InterfacePage;
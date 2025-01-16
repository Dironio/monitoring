import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import './MainPage.css';
import SiteSelection from '../../UI/SiteSelection';
import { User } from '../../../models/user.model';
import ChipsNavigation from '../../UI/ChipsNavigation';

interface MainPageProps {
    user: User | null;
    loading: boolean;
}

const MainPage: React.FC<MainPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: 'overview', label: 'Сводка отчетов' },
        { path: 'average-time', label: 'Среднее время на сайте' },
        // { path: 'behavior-metrics', label: 'Метрики поведения' },
        { path: 'visit-history', label: 'История посещений' },
        { path: 'sales-analytics', label: 'Аналитика продаж' },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    // const getActivePath = () => {
    //     return location.pathname.split('/').pop() || '';
    // };

    useEffect(() => {
        if (location.pathname === '/main') {
            navigate('overview');
        }
    }, [location.pathname, navigate]);

    return (
        <main className="main-page">
            <div className="wrapper-page">
                <ChipsNavigation
                    items={navItems}
                    onNavigate={handleNavigate}
                    currentPath={location.pathname.split('/').pop() || ''}
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
                        desktop: Infinity,
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

export default MainPage;

import './BehaviorMetricsPage.css';
import { User } from '../../../models/user.model';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import SiteSelection from '../../UI/SiteSelection';
import ChipsNavigation, { NavItem } from '../../UI/ChipsNavigation';

interface MetricPageProps {
    user: User | null;
    loading: boolean;
}

const MetricPage: React.FC<MetricPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigationItems: NavItem[] = [
        {
            path: 'event-analysis',
            label: 'Анализ событий'
        },
        {
            path: 'category',
            label: 'Категории пользователей'
        },
        {
            path: 'route-analysis',
            label: 'Анализ маршрутов'
        },
        {
            path: 'geography',
            label: 'География пользователей'
        }
    ];

    useEffect(() => {
        if (location.pathname === '/metrics') {
            navigate('event-analysis');
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

                <SiteSelection user={user} loading={loading} />

                <section className="content">
                    <Outlet />
                </section>
            </div>
        </main>
    );
};

export default MetricPage;

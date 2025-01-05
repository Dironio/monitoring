import './BehaviorMetricsPage.css';
import { User } from '../../../models/user.model';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import SiteSelection from '../../UI/SiteSelection';

interface MetricPageProps {
    user: User | null;
    loading: boolean;
}

const MetricPage: React.FC<MetricPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/metrics') {
            navigate('event-analysis');
        }
    }, [location.pathname, navigate]);

    //     navigate('overview');
    // }, [navigate]);

    return (
        <>
            <main className="main-page">
                <div className="wrapper-page">
                    <nav className="top-nav">
                        <ul className="nav-list">
                            <li className="">
                                <NavLink
                                    to="event-analysis"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Анализ событий
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="category"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Категории пользователей
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="route-analysis"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Анализ маршрутов
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="geography"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    География пользователей
                                </NavLink>
                            </li>
                            {/* <li className="">
                                <NavLink
                                    to="sales-analytics"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Аналитика продаж
                                </NavLink>
                            </li> */}
                        </ul>
                    </nav>

                    <SiteSelection user={user} loading={loading} />

                    <section className="content">
                        <Outlet />
                    </section>
                </div>
            </main>

        </>
    )
}

export default MetricPage;

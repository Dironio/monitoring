import './InterfacePage.css';
import { User } from '../../../models/user.model';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import SiteSelection from '../../UI/SiteSelection';

interface InterfacePageProps {
    user: User | null;
    loading: boolean;
}

const InterfacePage: React.FC<InterfacePageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/interface') {
            navigate('heatmap-page');
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
                                    to="heatmap-page"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Тепловая карта
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="heatmap-scroll"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Карта скроллов
                                </NavLink>
                            </li>
                            {/* <li className="">
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
                            </li> */}
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

export default InterfacePage;

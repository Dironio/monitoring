import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './MainPage.css';
import { useEffect } from 'react';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/main') {
            navigate('overview');
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
                                    to="overview"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Сводка отчетов
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="average-time"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Среднее время на сайте
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="behavior-metrics"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Метрики поведения
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="visit-history"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    История посещений
                                </NavLink>
                            </li>
                            <li className="">
                                <NavLink
                                    to="sales-analytics"
                                    className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
                                >
                                    Аналитика продаж
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    <section className="content">
                        <Outlet />
                    </section>
                </div>
            </main>

        </>
    )
}

export default MainPage;
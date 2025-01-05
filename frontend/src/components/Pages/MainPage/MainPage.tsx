import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './MainPage.css';
import { useEffect } from 'react';
import SiteSelection from '../../UI/SiteSelection';
import { User } from '../../../models/user.model';

interface MainPageProps {
    user: User | null;
    loading: boolean;
}

const MainPage: React.FC<MainPageProps> = ({ user, loading }) => {
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
                    {/* <div>
                        <div className="choose-site">
                            <img src="poloski.svg" alt="" className='choose-site__img'/>
                            <p className="choose-site__title">{web-site.name}</p> || <p>Не выбрано или Демо-режим</p> || 
                        </div>
                    </div> */}

                    <SiteSelection user={user} loading={loading} />

                    <section className="content">
                        <Outlet />
                    </section>
                </div>
            </main>

        </>
    )
}

export default MainPage;
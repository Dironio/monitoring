// import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import './MainPage.css';
// import { useEffect } from 'react';
// import SiteSelection from '../../UI/SiteSelection';
// import { User } from '../../../models/user.model';

// interface MainPageProps {
//     user: User | null;
//     loading: boolean;
// }

// const MainPage: React.FC<MainPageProps> = ({ user, loading }) => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         if (location.pathname === '/main') {
//             navigate('overview');
//         }
//     }, [location.pathname, navigate]);

//     //     navigate('overview');
//     // }, [navigate]);

//     return (
//         <>
//             <main className="main-page">
//                 <div className="wrapper-page">
//                     <nav className="top-nav">
//                         <ul className="nav-list">
//                             <li className="">
//                                 <NavLink
//                                     to="overview"
//                                     className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
//                                 >
//                                     Сводка отчетов
//                                 </NavLink>
//                             </li>
//                             <li className="">
//                                 <NavLink
//                                     to="average-time"
//                                     className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
//                                 >
//                                     Среднее время на сайте
//                                 </NavLink>
//                             </li>
//                             <li className="">
//                                 <NavLink
//                                     to="behavior-metrics"
//                                     className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
//                                 >
//                                     Метрики поведения
//                                 </NavLink>
//                             </li>
//                             <li className="">
//                                 <NavLink
//                                     to="visit-history"
//                                     className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
//                                 >
//                                     История посещений
//                                 </NavLink>
//                             </li>
//                             <li className="">
//                                 <NavLink
//                                     to="sales-analytics"
//                                     className={({ isActive }) => isActive ? 'nav-item selected' : 'nav-item'}
//                                 >
//                                     Аналитика продаж
//                                 </NavLink>
//                             </li>
//                         </ul>
//                     </nav>
//                     {/* <div>
//                         <div className="choose-site">
//                             <img src="poloski.svg" alt="" className='choose-site__img'/>
//                             <p className="choose-site__title">{web-site.name}</p> || <p>Не выбрано или Демо-режим</p> || 
//                         </div>
//                     </div> */}

//                     <SiteSelection user={user} loading={loading} />

//                     <section className="content">
//                         <Outlet />
//                     </section>
//                 </div>
//             </main>

//         </>
//     )
// }

// export default MainPage;





import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import './MainPage.css';
import SiteSelection from '../../UI/SiteSelection';
import { User } from '../../../models/user.model';

interface NavItem {
    path: string;
    label: string;
}

interface MainPageProps {
    user: User | null;
    loading: boolean;
}

const MainPage: React.FC<MainPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navRef = useRef<HTMLUListElement>(null);

    const initialNavItems: NavItem[] = [
        { path: 'overview', label: 'Сводка отчетов' },
        { path: 'average-time', label: 'Среднее время на сайте' },
        { path: 'behavior-metrics', label: 'Метрики поведения' },
        { path: 'visit-history', label: 'История посещений' },
        { path: 'sales-analytics', label: 'Аналитика продаж' },
    ];

    const [visibleItems, setVisibleItems] = useState<NavItem[]>(initialNavItems);
    const [hiddenItems, setHiddenItems] = useState<NavItem[]>([]);
    const [shouldShowSelect, setShouldShowSelect] = useState(true);

    const getActivePath = () => {
        return location.pathname.split('/').pop() || '';
    };

    const swapActiveItemToVisible = (
        currentVisible: NavItem[],
        currentHidden: NavItem[],
        activePath: string
    ) => {
        const activeInHiddenIndex = currentHidden.findIndex(item => item.path === activePath);

        if (activeInHiddenIndex !== -1) {
            const lastNonActiveVisibleIndex = [...currentVisible].reverse()
                .findIndex(item => item.path !== activePath);

            if (lastNonActiveVisibleIndex !== -1) {
                const actualIndex = currentVisible.length - 1 - lastNonActiveVisibleIndex;
                const activeItem = currentHidden[activeInHiddenIndex];
                const itemToHide = currentVisible[actualIndex];


                const newVisible = [...currentVisible];
                const newHidden = [...currentHidden];

                newVisible[actualIndex] = activeItem;
                newHidden[activeInHiddenIndex] = itemToHide;

                return {
                    newVisible,
                    newHidden
                };
            }
        }

        return {
            newVisible: currentVisible,
            newHidden: currentHidden
        };
    };

    const calculateVisibleItems = () => {
        if (!navRef.current) return;

        const navContainer = navRef.current;
        const containerWidth = navContainer.offsetWidth;
        const SELECT_WIDTH = 100;
        const GAP_WIDTH = 20;
        const MINIMUM_VISIBLE_ITEMS = 1;

        // переделать
        let maxVisibleItems;
        if (containerWidth <= 705) {
            maxVisibleItems = 2;
        } else if (containerWidth <= 1060) {
            maxVisibleItems = 3;
        } else if (containerWidth <= 1200) {
            maxVisibleItems = 4;
        } else {
            maxVisibleItems = initialNavItems.length;
        }

        let currentWidth = 0;
        let visible: NavItem[] = [];
        let hidden: NavItem[] = [];

        const firstItemWidth = navContainer.children[0]?.getBoundingClientRect().width || 0;
        visible.push(initialNavItems[0]);
        currentWidth += firstItemWidth + GAP_WIDTH;

        for (let i = 1; i < initialNavItems.length; i++) {
            const itemWidth = navContainer.children[i]?.getBoundingClientRect().width || 0;

            if (currentWidth + itemWidth + SELECT_WIDTH + GAP_WIDTH <= containerWidth &&
                visible.length < maxVisibleItems) {
                visible.push(initialNavItems[i]);
                currentWidth += itemWidth + GAP_WIDTH;
            } else {
                hidden.push(initialNavItems[i]);
            }
        }

        const activePath = getActivePath();
        const result = swapActiveItemToVisible(visible, hidden, activePath);
        visible = result.newVisible;
        hidden = result.newHidden;

        setVisibleItems(visible);
        setHiddenItems(hidden);
        setShouldShowSelect(true);
    };

    const handleSelectChange = (value: string) => {
        if (value) {
            navigate(value);
            setTimeout(calculateVisibleItems, 0);
        }
    };

    useEffect(() => {
        if (location.pathname === '/main') {
            navigate('overview');
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        const handleResize = () => {
            requestAnimationFrame(calculateVisibleItems);
        };

        window.addEventListener('resize', handleResize);
        setTimeout(calculateVisibleItems, 100);

        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    return (
        <main className="main-page">
            <div className="wrapper-page">
                <nav className="top-nav">
                    <ul className="nav-list" ref={navRef}>
                        {visibleItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        isActive ? 'nav-item selected' : 'nav-item'
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                        {shouldShowSelect && (
                            <li className="nav-select">
                                <Select.Root onValueChange={handleSelectChange}>
                                    <Select.Trigger className="nav-item select-trigger">
                                        <Select.Value placeholder="Ещё" />
                                        <Select.Icon className="select-icon">
                                            <ChevronDown size={20} />
                                        </Select.Icon>
                                    </Select.Trigger>

                                    <Select.Portal>
                                        <Select.Content className="select-content" position="popper" sideOffset={5}>
                                            <Select.Viewport className="select-viewport">
                                                {hiddenItems.length > 0 ? (
                                                    hiddenItems.map((item) => (
                                                        <Select.Item
                                                            key={item.path}
                                                            value={item.path}
                                                            className={`select-item ${item.path === getActivePath() ? 'selected' : ''}`}
                                                        >
                                                            <Select.ItemText>{item.label}</Select.ItemText>
                                                        </Select.Item>
                                                    ))
                                                ) : (
                                                    <div className="select-empty">
                                                        <span>Нет дополнительных пунктов</span>
                                                    </div>
                                                )}
                                            </Select.Viewport>
                                        </Select.Content>
                                    </Select.Portal>
                                </Select.Root>
                            </li>
                        )}
                    </ul>
                </nav>

                <SiteSelection user={user} loading={loading} />

                <section className="content">
                    <Outlet />
                </section>
            </div>
        </main>
    );
};

export default MainPage;

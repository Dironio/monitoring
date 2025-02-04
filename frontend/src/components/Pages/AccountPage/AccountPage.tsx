import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './AccountPage.css'
import { User } from '../../../models/user.model';
import ChipsNavigation, { NavItem } from '../../UI/ChipsNavigation';
import { useEffect } from 'react';

interface AccountPageProps {
    user: User | null;
    loading: boolean;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navigationItems: NavItem[] = [
        {
            path: 'main',
            label: 'Личный кабинет'
        },
        {
            path: 'settings',
            label: 'Настройки'
        },
        {
            path: 'application',
            label: 'Заявки'
        },
        {
            path: 'analysis',
            label: 'Аналитика'
        },
    ];

    useEffect(() => {
        if (location.pathname === '/account') {
            navigate('main');
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
                        laptop: 3,
                        desktop: 4,
                    }}
                />

                <section className="content">
                    <Outlet />
                </section>
            </div>
        </main >
    );
};

// <>
//     <main>
//         <div className="wrapper">
//             <div className="bg-white">
//                 <div className="account-header">
//                     <p className="account-header__logo">
//                         Добро пожаловать{user?.first_name ? ", " : ""}
//                         <span>{user?.first_name || ""}</span>
//                     </p>
//                 </div>

//                 <div className="account-title">
//                     <p className="account-header__logo">Хотите отслеживать свой сайт?</p>
//                     <Link to="/application">
//                         <button className="account-header__btn">Оставить заявку</button>
//                     </Link>
//                 </div>

//                 <div className="account-grid">
//                     <Link to="/account/settings" className="account-grid__item">
//                         <h3 className="item-title">Настройки пользователя</h3>
//                         <p className="item-description">Изменить имя, картинки и т.д.</p>
//                     </Link>

//                     <Link to="/account/main" className="account-grid__item">
//                         <h3 className="item-title">Аналитика моего сайта</h3>
//                         <p className="item-description">Для владельцев и администраторов сайтов</p>
//                     </Link>

//                     <Link to="/account/sales-analytics" className="account-grid__item">
//                         <h3 className="item-title">Аналитика продаж</h3>
//                         <p className="item-description">
//                             Для продавцов, работающих на поддерживаемом сайте. Аналитика посещения товаров и т.д.
//                         </p>
//                     </Link>

//                     <Link to="/account/sales" className="account-grid__item">
//                         <h3 className="item-title">Продажи</h3>
//                         <p className="item-description">
//                             Управление продажами и мониторинг статистики.
//                         </p>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     </main>
// </>
//     )
// }

export default AccountPage;
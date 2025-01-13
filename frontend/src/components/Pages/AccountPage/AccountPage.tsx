import { Link, Outlet } from 'react-router-dom';
import './AccountPage.css'
import { User } from '../../../models/user.model';

interface AccountPageProps {
    user: User | null;
    loading: boolean;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, loading }) => {
    return (
        <>
            <main>
                <div className="wrapper">
                    <div className="bg-white">
                        <div className="account-header">
                            <p className="account-header__logo">
                                Добро пожаловать{user?.first_name ? "," : ""}
                                <span>{user?.first_name || ""}</span>
                            </p>
                        </div>

                        <div className="account-title">
                            <p className="account-header__logo">Хотите отслеживать свой сайт?</p>
                            <Link to="/application">
                                <button className="main-header__btn">Оставить заявку</button>
                            </Link>
                        </div>

                        <div className="account-grid">
                            <Link to="/account/settings" className="account-grid__item">
                                <h3 className="item-title">Настройки пользователя</h3>
                                <p className="item-description">Изменить имя, картинки и т.д.</p>
                            </Link>

                            <Link to="/account/main" className="account-grid__item">
                                <h3 className="item-title">Аналитика моего сайта</h3>
                                <p className="item-description">Для владельцев и администраторов сайтов</p>
                            </Link>

                            <Link to="/account/sales-analytics" className="account-grid__item">
                                <h3 className="item-title">Аналитика продаж</h3>
                                <p className="item-description">
                                    Для продавцов, работающих на поддерживаемом сайте. Аналитика посещения товаров и т.д.
                                </p>
                            </Link>

                            <Link to="/account/sales" className="account-grid__item">
                                <h3 className="item-title">Продажи</h3>
                                <p className="item-description">
                                    Управление продажами и мониторинг статистики.
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default AccountPage;
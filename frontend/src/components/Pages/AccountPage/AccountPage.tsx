import { Link } from 'react-router-dom';
import './AccountPage.css'

const AccountPage: React.FC = () => {
    return (
        <>
            <main>
                <div className="wrapper">
                    <div className="bg-white">
                        <div className="main-header">
                            <p className="main-header__logo">Добро пожаловать
                                {/* {<span>,user.first_name</span> || ''}  */}
                            </p>
                        </div>

                        <div className="main-header">
                            <p className="main-header__logo">Хотите отслеживать свой сайт?</p>
                            <Link to="/application">
                                <button className="main-header__btn">Оставить заявку</button>
                            </Link>
                        </div>




                        <div className="main-grid">
                            <div className="main-grid__item">
                                <h3 className="item-title">Настройки пользователя</h3>
                                <p className="item-description">Изменить имя, картинки и тд</p>
                            </div>
                            <div className="main-grid__item">
                                <h3 className="item-title">Аналитика моего сайта</h3>
                                <p className="item-description">Для владельцев и администраторов сайтов</p>
                            </div>
                            <div className="main-grid__item">
                                <h3 className="item-title">Аналитика продаж</h3>
                                <p className="item-description">Для продавцов, работающих на поддерживаемом сайте. Аналитика посещения товаров и тд</p>
                                <button className="grid-item__btn">Подробнее</button>
                            </div>
                            <div className="main-grid__item">
                                <h3 className="item-title">Аналитика продаж</h3>
                                <p className="item-description">Для продавцов, работающих на поддерживаемом сайте. Аналитика посещения товаров и тд</p>
                                <button className="grid-item__btn">Подробнее</button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}

export default AccountPage;
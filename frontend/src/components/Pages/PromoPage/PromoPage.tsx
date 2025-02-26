import { User } from '../../../models/user.model';
import './PromoPage.css'

interface PromoPageProps {
    user?: User | null;
    loading?: boolean;
}

const PromoPage: React.FC<PromoPageProps> = ({ user, loading }) => {

    return (
        <main>
            <div className="wrapper">
                <div className="bg-white">
                    <div className="main-header">
                        <p className="main-header__logo">Информационная система для мониторинга и анализа
                            <br />
                            поведения пользователей на веб-платформе</p>
                        <button className="main-header__btn">Начать работу</button>
                    </div>
                    <div className="main-grid">
                        <div className="main-grid__item">
                            <img src="https://via.placeholder.com/300" alt="Шестой элемент" className="grid-item__image" />
                            <h3 className="item-title">Анализ аудитории</h3>
                            <p className="item-description">Узнайте своих пользователей – кто они, чем интересуются и что у них
                                общего</p>
                            <button className="grid-item__btn">Подробнее</button>
                        </div>
                        <div className="main-grid__item">
                            <img src="https://via.placeholder.com/300" alt="Шестой элемент" className="grid-item__image" />
                            <h3 className="item-title">Анализ поведения</h3>
                            <p className="item-description">Изучайте поведение пользователей – что их приводит к целевым
                                действиям</p>
                            <button className="grid-item__btn">Подробнее</button>
                        </div>
                        <div className="main-grid__item">
                            <img src="https://via.placeholder.com/300" alt="Шестой элемент" className="grid-item__image" />
                            <h3 className="item-title">Третий элемент</h3>
                            <p className="item-description">Тестовое описание</p>
                            <button className="grid-item__btn">Подробнее</button>
                        </div>
                        <div className="main-grid__item">
                            <img src="https://via.placeholder.com/300" alt="Шестой элемент" className="grid-item__image" />
                            <h3 className="item-title">Четвертый элемент</h3>
                            <p className="item-description">Тестовое описание</p>
                            <button className="grid-item__btn">Подробнее
                                <img src="/frontend/public/assets/strelka.svg" alt="" />
                            </button>
                        </div>
                        <div className="main-grid__item">
                            <img src="https://via.placeholder.com/300" alt="Шестой элемент" className="grid-item__image" />
                            <h3 className="item-title">Пятый элемент</h3>
                            <p className="item-description">Тестовое описание</p>
                            <button className="grid-item__btn">Подробнее</button>
                        </div>
                        <div className="main-grid__item">
                            <img src="https://via.placeholder.com/300" alt="Шестой элемент" className="grid-item__image" />
                            <h3 className="item-title">Шестой элемент</h3>
                            <p className="item-description">Тестовое описание</p>
                            <button className="grid-item__btn">Подробнее</button>
                        </div>
                    </div>

                </div>
                {user ? (
                    <div className="footer-main"></div>
                ) : (
                    <div className="footer-main">
                        <p className="footer-main__title">Принимайте быстрые и эффективные решения на основе данных</p>
                        <div className="footer-main__btn">
                            <button className="footer-main__btn-start">Начать пользоваться</button>
                        </div>
                    </div>

                )}
            </div>
        </main>
    )
}

export default PromoPage;
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
                <div className="bg-white-promo">
                    <div className="main-header">
                        <p className="main-header__logo">Информационная система для мониторинга и анализа
                            <br />
                            поведения пользователей на веб-платформе</p>
                        <button className="main-header__btn">Начать работу</button>
                    </div>
                    <div className="main-grid">
                        <div className="main-grid__item">
                            <img src="/assets/zaglushka.jpg" alt="Анализ аудитории" className="grid-item__image" />
                            <h3 className="item-title">Анализ аудитории</h3>
                            <p className="item-description">Узнайте своих пользователей – кто они, чем интересуются и что у них общего</p>
                            <button className="grid-item__btn">Перейти</button>
                        </div>

                        <div className="main-grid__item">
                            <img src="/assets/zaglushka.jpg" alt="Анализ поведения" className="grid-item__image" />
                            <h3 className="item-title">Анализ поведения</h3>
                            <p className="item-description">Изучайте поведение пользователей – что их приводит к целевым действиям</p>
                            <button className="grid-item__btn">Перейти</button>
                        </div>

                        <div className="main-grid__item">
                            <img src="/assets/zaglushka.jpg" alt="Тепловая карта" className="grid-item__image" />
                            <h3 className="item-title">Тепловая карта</h3>
                            <p className="item-description">Визуализация кликов и скроллинга пользователей на сайте</p>
                            <button className="grid-item__btn">Перейти</button>
                        </div>

                        <div className="main-grid__item">
                            <img src="/assets/zaglushka.jpg" alt="Сегментация" className="grid-item__image" />
                            <h3 className="item-title">Сегментация</h3>
                            <p className="item-description">Разделение аудитории на группы по определённым критериям</p>
                            <button className="grid-item__btn">
                                Перейти
                                <img src="/frontend/public/assets/strelka.svg" alt="" />
                            </button>
                        </div>

                        <div className="main-grid__item">
                            <img src="/assets/zaglushka.jpg" alt="Эксперименты" className="grid-item__image" />
                            <h3 className="item-title">Эксперименты</h3>
                            <p className="item-description">Опросы, тестирование и прочие экспериментальные функции</p>
                            <button className="grid-item__btn">Перейти</button>
                        </div>

                        <div className="main-grid__item">
                            <img src="/assets/zaglushka.jpg" alt="Конверсии" className="grid-item__image" />
                            <h3 className="item-title">Конверсии</h3>
                            <p className="item-description">Анализ показателей конверсии на каждом этапе воронки</p>
                            <button className="grid-item__btn">Перейти</button>
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
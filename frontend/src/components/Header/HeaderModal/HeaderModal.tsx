import { Link } from "react-router-dom";
import { useLogout } from "../../../hooks/useLogout";
import { User } from "../../../models/user.model";
import './HeaderModal.css';
import { useEffect, useState } from "react";
import { HeaderRole } from "../HeaderRole";

interface HeaderModalProps {
    user: User | null;
    closeModal: () => void;
}

// пофиксить стили
const HeaderModal: React.FC<HeaderModalProps> = ({ user, closeModal }) => {
    const { handleLogout } = useLogout(() => closeModal());
    const [isVisible, setIsVisible] = useState(false);

    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsVisible(true);
        });
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(closeModal, 300);
    };

    return (
        <div className={`header-modal ${isVisible ? 'show' : ''}`} onClick={handleModalClick}>
            <div className="header-modal__user">
                <div className="header-modal__logo">
                    <img
                        className="header-modal__logo-img"
                        src="/assets/user.svg"
                        alt="Пользователь"
                    />
                </div>

                <div className="header-modal__personal-info">
                    <p className="header-modal__username">{user?.username}</p>
                    <p className="header-modal__email">{user?.email}</p>
                </div>

                <div className="header-modal__settings">
                    <Link to="/account/settings" onClick={closeModal} className="header-modal__settings-link">
                        <img
                            src="/assets/settings-icon.svg"
                            alt="Настройки"
                            className="header-modal__settings-img"
                        />
                    </Link>
                </div>

            </div>

            {/* <HeaderRole user={user} /> */}

            <nav className="header-modal__nav">
                <Link to="/account" >
                    <div className="header-modal__nav-item">
                        <img src="/assets/personal-acc.svg" alt="" />
                        <p>Личный кабинет</p>
                    </div>
                </Link>

                <Link to="/account/application" >
                    <div className="header-modal__nav-item">
                        <img src="/assets/application.svg" alt="" />
                        <p>Оставить заявку</p>
                    </div>
                </Link>
            </nav>

            <hr className="header-modal__hr" />

            <div className="header-modal__logout" onClick={handleLogout}>
                <img src="/assets/logout.svg" alt="" />
                <p>Выйти</p>

                {/* <button
                    className="header-modal__logout-btn"
                    onClick={handleLogout}
                >
                    Выйти
                </button> */}
            </div>

            <hr className="header-modal__hr" />

            <div className="header-modal__info">
                <button
                    className="header-modal__info-btn"
                    onClick={closeModal}
                >
                    Условия использования
                </button>
                <button
                    className="header-modal__info-btn"
                    onClick={closeModal}
                >
                    Политика конфиденциальности
                </button>
            </div>

            {/* <button
                className="header-modal__close-btn"
                onClick={closeModal}
            >
                Закрыть
            </button> */}

            <button
                className="header-modal__close-btn"
                onClick={closeModal}
                aria-label="Закрыть"
            >
                {/* Крестик с использованием псевдоэлементов */}
                <span className="header-modal__close-icon"></span>
            </button>
        </div>
    );
};

export default HeaderModal;
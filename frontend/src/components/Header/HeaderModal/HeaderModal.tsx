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
// картинку на настройки
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
                <Link to="/account" onClick={closeModal}>
                    <p className="settings-user">Настройки</p>
                    <img
                        src="/assets/settings-icon.svg"
                        alt="Настройки"
                        className="header-modal__logo-img"
                    />
                </Link>
            </div>

            <hr />

            <div className="header-modal__logout">
                <button
                    className="header-modal__logout-btn"
                    onClick={handleLogout}
                >
                    Выйти
                </button>
            </div>

            <button
                className="header-modal__close-btn"
                onClick={closeModal}
            >
                Закрыть
            </button>
        </div>
    );
};

export default HeaderModal;
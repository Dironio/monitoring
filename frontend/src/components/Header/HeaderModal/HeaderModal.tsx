import { Link } from "react-router-dom";
import { useLogout } from "../../../hooks/useLogout";
import { User } from "../../../models/user.model";
import './HeaderModal.css';

interface HeaderModalProps {
    user: User | null;
    closeModal: () => void;
}

// пофиксить закрытие
// пофиксить стили
// картинку на настройки
const HeaderModal: React.FC<HeaderModalProps> = ({ user, closeModal }) => {
    const { handleLogout } = useLogout(() => closeModal());

    return (
        <div className="header-modal">
            <div className="header-modal__logo">
                <img className="header-modal__logo-img" src="/assets/user.svg" alt="Логотип" />
            </div>

            <div className="header-modal__personal-info">
                <p className="header-modal__username">{user?.username}</p>
                <p className="header-modal__email">{user?.email}</p>
            </div>

            <div className="header-modal__settings">
                <Link to="/account">
                    <p className="settings-user">Настройки</p>
                    <img src="/assets/user.svg" alt="Настройки" />
                </Link>
            </div>

            <hr />
            {/* СДЕЛАТЬ СТИЛЬ */}

            <div className="header-modal__logout">
                <button className="header-modal__logout-btn" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default HeaderModal;
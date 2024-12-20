import { useLogout } from "../../../hooks/useLogout";

interface HeaderModalProps {
    username: string; //мб переделать
    email: string;
    closeModal: () => void;
}

const HeaderModal: React.FC<HeaderModalProps> = ({ username, email, closeModal }) => {
    const { handleLogout } = useLogout(() => closeModal());

    return (
        <div className="header-modal">
            <div className="header-modal__logo">
                <img src="/assets/logo.svg" alt="Логотип" />
            </div>

            <div className="header-modal__personal-info">
                <p className="header-modal__username">{username}</p>
                <p className="header-modal__email">{email}</p>
            </div>

            <div className="header-modal__settings">
                <p className="settings-user">Настройки</p>
                <img src="/assets/settings-icon.svg" alt="Настройки" />
            </div>

            <hr />

            <div className="header-modal__logout">
                <button className="header-modal__logout-btn" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        </div>
    );
};

export default HeaderModal;
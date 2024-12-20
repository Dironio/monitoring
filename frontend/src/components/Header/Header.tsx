import { Link } from 'react-router-dom';
import './Header.css'
import { User } from '../../models/user.model';

interface HeaderProps {
    user: User | null;
}
//затестить
const Header: React.FC<HeaderProps> = ({ user }) => {

    return (
        <header className="header">
            <a href="/" className="header__link">
                <h2 className="header__logo">Анализ и мониторинг поведения</h2>
            </a>
            {user ? (
                <div className="header__info-user">
                    <button className="header__btn">Мои товары</button>
                    <p className="header__role">Аналитик</p>
                    {/* <img
                        className="header__img"
                        src="/assets/user.svg"
                        alt="Пользователь"
                        onClick={toggleModal}
                    />

                    {isModalOpen && (
                        <div ref={modalRef}>
                            <HeaderModal
                                user={user}
                                closeModal={() => setIsModalOpen(false)}
                            />
                        </div>
                    )} */}
                </div>
            ) : (
                <div className="header__info-user">
                    <Link to="/auth">
                        <button className="header__btn">Войти</button>
                    </Link>
                </div>
            )}
        </header>
    )
}

export default Header;
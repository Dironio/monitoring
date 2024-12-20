import { Link } from 'react-router-dom';
import './Header.css'
import { User } from '../../models/user.model';
import { useEffect, useRef, useState } from 'react';
import HeaderModal from './HeaderModal/HeaderModal';

interface HeaderProps {
    user: User | null;
}
//затестить
const Header: React.FC<HeaderProps> = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]);
    return (
        <header className="header">
            <a href="/" className="header__link">
                <h2 className="header__logo">Анализ и мониторинг поведения</h2>
            </a>
            {user ? (
                <div className="header__info-user">
                    <button className="header__btn">Мои товары</button>
                    <p className="header__role">{user?.role}</p>
                    <img
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
                    )}
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
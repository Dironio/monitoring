import { Link } from "react-router-dom";
import "./Header.css";
import { User } from "../../models/user.model";
import { useEffect, useRef, useState } from "react";
import HeaderModal from "./HeaderModal/HeaderModal";
import { HeaderRole } from "./HeaderRole";

interface HeaderProps {
    user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [headerTitle, setHeaderTitle] = useState("Мониторинг и анализ поведения пользователей");

    const toggleModal = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(!isModalOpen);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const userIcon = document.querySelector('.header__img');
            if (userIcon && userIcon.contains(event.target as Node)) {
                return;
            }

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

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width < 1230 && width >= 769) {
                setHeaderTitle("Мониторинг и анализ");
            } else if (width < 769) {
                setHeaderTitle("МАПП");
            } else {
                setHeaderTitle("Мониторинг и анализ поведения пользователей");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <header className="header">
            <a href="/" className="header__link">
                <h2 className="header__logo">{headerTitle}</h2>
            </a>
            {user ? (
                <div className="header__info-user">
                    <div className="header__role-btn">
                        <HeaderRole user={user} />
                    </div>
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
                                closeModal={closeModal}
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
    );
};

export default Header;

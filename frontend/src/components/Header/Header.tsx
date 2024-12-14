import './Header.css'

const Header: React.FC = () => {
    return (
        <header className="header">
            <h2 className="header__logo">Анализ и мониторинг поведения</h2>
            <div className="header__info-user">
                <button className="header__btn">Мои товары</button>
                <p className="header__role">Аналитик</p>
                <img className="header__img" src="/assets/user.svg" alt="" />
            </div>
        </header>
    )
}

export default Header;
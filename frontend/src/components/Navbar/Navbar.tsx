import './Navbar.css'

interface NavbarProps {
    isExpanded: boolean;
    toggleNavbar: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ isExpanded, toggleNavbar }) => {
    return (
        <>

            <div className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
                <button className="toggle-btn" onClick={toggleNavbar}>
                    {isExpanded ? "111" : "222"}
                </button>
                {
                    isExpanded ? (
                        <div className="sidebar">
                            <li className="dashbord">
                                <div className="dashobord_item-1">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M12 2L3 9h3v13h6V14h2v8h6V9h3z"></path>
                                    </svg>
                                    <h1 className="sidebar-title">ДАШБОРД</h1>
                                </div>

                                <div className="dashobord_item-2">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M12 2L3 9h3v13h6V14h2v8h6V9h3z"></path>
                                    </svg>
                                </div>
                            </li>

                            <div className="search-box">
                                <input type="text" placeholder="Поиск..." />
                            </div>
                            <ul className="menu">
                                <li className="menu-item selected">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M12 2L3 9h3v13h6V14h2v8h6V9h3z"></path>
                                    </svg>
                                    Главная
                                </li>
                                <li className="menu-item">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 17h2v2h-2zm0-10h2v8h-2z"></path>
                                    </svg>
                                    Общие метрики
                                </li>
                                <li className="menu-item">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M3 13h8V3H3zm2-8h4v4H5zm10-2v18h2V3h-2zm4 2v14h2V5h-2z"></path>
                                    </svg>
                                    Временные метрики
                                </li>
                                <li className="menu-item">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 13h8v2H8zm0-4h8v2H8z"></path>
                                    </svg>
                                    Метрики поведения
                                </li>
                                <li className="menu-item">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M3 3v18h18V3H3zm16 16H5V5h14v14z"></path>
                                    </svg>
                                    Графы и навигация
                                </li>
                                <li className="menu-item">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M3 13h8V3H3zm2-8h4v4H5zm10-2v18h2V3h-2zm4 2v14h2V5h-2z"></path>
                                    </svg>
                                    Модели прогнозов
                                </li>
                                <li className="menu-item">
                                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="#656565" d="M12 2a10 10 0 100 20 10 10 0 000-20zM8 13h8v2H8zm0-4h8v2H8z"></path>
                                    </svg>
                                    Эксперименты
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className=""></div>
                    )
                }
            </div>
        </>
    )
}

export default Navbar;

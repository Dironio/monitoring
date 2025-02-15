import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';
import SearchBar from "./SearchBar";

interface NavbarProps {
    isExpanded: boolean;
    toggleNavbar: () => void;
}

const Sidebar: React.FC<NavbarProps> = ({ isExpanded, toggleNavbar }) => {
    const location = useLocation();
    const [activeItem, setActiveItem] = useState<string>(location.pathname);
    const [searchResults, setSearchResults] = useState<{ path: string; label: string; icon: string }[]>([]);
    const [isSearchActive, setSearchActive] = useState(false);

    const menuItems = [
        { path: "/main", label: "Главная", icon: "/assets/main.svg" },
        { path: "/metrics", label: "Метрики поведения", icon: "/assets/graphs-navigation.svg" },
        { path: "/interface", label: "Интерфейс", icon: "/assets/behavior-metrics.svg" },
        { path: "/models", label: "Модели", icon: "/assets/forecast-models.svg" },
        { path: "/analytics", label: "Анализ поведения", icon: "/assets/common-metrics.svg" },
        { path: "/trands", label: "Тренды", icon: "/assets/time-metrics.svg" },
        { path: "/experiments", label: "Эксперименты", icon: "/assets/experiments.svg" },
    ];

    useEffect(() => {
        setActiveItem(location.pathname);
    }, [location.pathname]);

    const handleSearch = (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        const filtered = menuItems.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
    };

    const handleSearchIconClick = () => {
        if (!isExpanded) {
            toggleNavbar();
            setSearchActive(true);
        } else {
            setSearchActive(!isSearchActive);
        }
    };

    useEffect(() => {
        const basePath = location.pathname.split('/')[1];
        setActiveItem(`/${basePath}`);
    }, [location.pathname]);

    return (
        <>
            {isExpanded ? (
                <div className="sidebar">
                    <li className="dashbord">
                        <div className="dashobord_item-1">
                            <img src="/assets/dashboard.svg" alt="" />
                            <h1 className="sidebar-title">ДАШБОРД</h1>
                        </div>
                        <div className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
                            <button className="toggle-btn" onClick={toggleNavbar}>
                                <img src="/assets/arrow.svg" alt="" className="toggle-btn-arrow" />
                            </button>
                        </div>
                    </li>
                    <div className="search-box">
                        <div className="search-box__items">

                            <SearchBar
                                onSearch={handleSearch}
                                results={searchResults}
                            />
                            <img
                                src="/assets/find.svg"
                                alt=""
                                onClick={handleSearchIconClick}
                            />

                        </div>
                    </div>
                    <ul className="menu">
                        {menuItems.map(item => (
                            <Link
                                to={item.path}
                                key={item.path}
                                className={`menu-item ${activeItem === item.path ? "selected" : ""}`}
                            >
                                <img className="menu-item-img" src={item.icon} alt="" />
                                <p>{item.label}</p>
                            </Link>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="collapsed-sidebar">
                    <div className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
                        <button className="toggle-btn" onClick={toggleNavbar}>
                            <img
                                src="/assets/arrow.svg"
                                alt=""
                                className="toggle-btn-arrow" />
                        </button>
                    </div>


                    <div className="search-box">
                        <img
                            src="/assets/find.svg"
                            alt=""
                            onClick={toggleNavbar}
                        />
                    </div>

                    <ul className="menu">
                        {menuItems.map(item => (
                            <Link
                                to={item.path}
                                key={item.path}
                                className={`menu-item ${activeItem === item.path ? "selected" : ""}`}
                                title={item.label}
                            >
                                <img src={item.icon} alt="" />
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Sidebar;

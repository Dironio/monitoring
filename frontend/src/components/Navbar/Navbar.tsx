import './Navbar.css'
import { useEffect, useState } from "react";

interface NavbarProps {
    isExpanded: boolean;
    toggleNavbar: () => void;
}
const Sidebar: React.FC<NavbarProps> = ({ isExpanded, toggleNavbar }) => {
    return (
        <>
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

                            <div className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
                                <button className="toggle-btn" onClick={toggleNavbar}>
                                    {isExpanded ? <img src="/assets/arrow.svg" alt="" /> : <img src="/assets/arrow.svg" alt="" />}
                                </button>
                            </div>
                        </li>

                        <div className="search-box">
                            <input type="text" placeholder="Поиск..." />
                            <img src="/assets/find.svg" alt="" />
                        </div>
                        <ul className="menu">
                            <li className="menu-item selected">
                                <img src="/assets/main.svg" alt="" />
                                <p>Главная</p>
                            </li>
                            <li className="menu-item">
                                <img src="/assets/common-metrics.svg" alt="" />
                                Общие метрики
                            </li>
                            <li className="menu-item">
                                <img src="/assets/time-metrics.svg" alt="" />
                                Временные метрики
                            </li>
                            <li className="menu-item">
                                <img src="/assets/behavior-metrics.svg" alt="" />
                                Метрики поведения
                            </li>
                            <li className="menu-item">
                                <img src="/assets/graphs-navigation.svg" alt="" />
                                Графы и навигация
                            </li>
                            <li className="menu-item">
                                <img src="/assets/forecast-models.svg" alt="" />
                                Модели прогнозов
                            </li>
                            <li className="menu-item">
                                <img src="/assets/experiments.svg" alt="" />
                                Эксперименты
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="collapsed-sidebar">

                        <div className={`navbar ${isExpanded ? "expanded" : "collapsed"}`}>
                            <button className="toggle-btn" onClick={toggleNavbar}>
                                {isExpanded ? <img src="/assets/arrow.svg" alt="" /> : <img src="/assets/arrow.svg" alt="" />}
                            </button>
                        </div>

                        <div className="search-box">
                            <img src="/assets/find.svg" alt="" />
                        </div>

                        <ul className="menu">
                            <div className="sidebar-icon">
                                <img src="/assets/main.svg" alt="" />
                            </div>
                            <div className="sidebar-icon">
                                <img src="/assets/common-metrics.svg" alt="" />
                            </div>
                            <div className="sidebar-icon">
                                <img src="/assets/time-metrics.svg" alt="" />
                            </div>
                            <div className="sidebar-icon">
                                <img src="/assets/behavior-metrics.svg" alt="" />
                            </div>
                            <div className="sidebar-icon">
                                <img src="/assets/graphs-navigation.svg" alt="" />
                            </div>
                            <div className="sidebar-icon">
                                <img src="/assets/forecast-models.svg" alt="" />
                            </div>
                            <div className="sidebar-icon">
                                <img src="/assets/experiments.svg" alt="" />
                            </div>
                        </ul>
                    </div>
                )}
        </>
    )
}

export default Sidebar;
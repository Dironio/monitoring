import React, { useState } from 'react';
import { User } from './models/user.model';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css'
import PromoPage from './components/Pages/PromoPage/PromoPage';
import Sidebar from './components/Navbar/Navbar';
import AuthPage from './components/Pages/AuthPage/AuthPage';
import MainPage from './components/Pages/MainPage/MainPage';
import AccountPage from './components/Pages/AccountPage/AccountPage';
import ApplicationPage from './components/Pages/ApplicationPage/ApplicationPage';
import AccountSetting from './components/Pages/AccountPage/AccountSettings/AccountSetting';


const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);

    const toggleNavbar = () => {
        setIsNavbarExpanded(!isNavbarExpanded);
    };


    return (
        <div className="App">
            <div className={`app-container ${isNavbarExpanded ? "with-sidebar" : "without-sidebar"}`}>
                {/* {user ? () : null} */}
                <Sidebar
                    isExpanded={isNavbarExpanded}
                    toggleNavbar={toggleNavbar}
                // user={user}
                />


                <div className="main-content">

                    <Header
                    // user={user}
                    />

                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PromoPage
                                />}
                        />

                        <Route
                            path="/auth"
                            element={
                                <AuthPage
                                />}
                        />




                        {/* user ? ( */}

                        <Route
                            path="/account"
                            element={
                                // user ? <Navigate to="/auth" /> :
                                <AccountPage />
                            }
                        />
                        <Route
                            path="/application"
                            element={
                                // user ? <Navigate to="/auth" /> :
                                <ApplicationPage />
                            }
                        />


                        <Route path="/account/settings" element={<AccountSetting />} />



                        <Route path="/main" element={<MainPage />} />
                        <Route path="/common-metrics" element={<h1>Общие метрики</h1>} />
                        <Route path="/time-metrics" element={<h1>Временные метрики</h1>} />
                        <Route path="/behavior-metrics" element={<h1>Метрики поведения</h1>} />
                        <Route path="/graphs-navigation" element={<h1>Графы и навигация</h1>} />
                        <Route path="/forecast-models" element={<h1>Модели прогнозов</h1>} />
                        <Route path="/experiments" element={<h1>Эксперименты</h1>} />



                        {/* <Route
                            path="/"
                            element={
                                user ? <Navigate to="/auth" /> :
                                    <HomePage
                                        user={user} />
                            }
                        /> */}


                    </Routes>

                </div>
            </div>
        </div >
    );
};

export default App;
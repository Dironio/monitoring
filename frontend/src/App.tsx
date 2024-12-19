import React, { useState } from 'react';
import { config } from 'dotenv';
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
import OverviewComponent from './components/Pages/MainPage/Components/OverviewComponent';
import UnknownPage from './components/Pages/UnknowPage/UnknowPage';
import { useFetchUser } from './hooks/useCurrentUser';

const App: React.FC = () => {
    const [isNavbarExpanded, setIsNavbarExpanded] = useState<boolean>(() => {
        const savedState = localStorage.getItem("navbarExpanded");
        return savedState ? JSON.parse(savedState) : true;
    });
    const { user, loading } = useFetchUser();

    console.log(user)

    if (loading) {
        return <div>Загрузка...</div>;
    }


    const toggleNavbar = () => {
        setIsNavbarExpanded((prev) => {
            const newState = !prev;
            localStorage.setItem("navbarExpanded", JSON.stringify(newState));
            return newState;
        });
    };


    return (
        <div className="App">
            {/* <div className={`app-container ${isNavbarExpanded ? "with-sidebar" : "without-sidebar"}`}> */}

            {/* <div className={`app-container ${user ? "with-sidebar" : "without-sidebar"}`}>
                {user && <Sidebar
                    isExpanded={isNavbarExpanded}
                    toggleNavbar={toggleNavbar}
                // user={user}
                />}

                <div className="main-content">

                    <Header
                    // user={user}
                    />


                    <Routes>

                        <Route path="*" element={<UnknowPage />} />

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




                        {/* user ? ( 

                        <Route
                            path="/account"
                            element={
                                // user ? <Navigate to="/auth" /> :
                                <AccountPage />
                            }
                        />
                        <Route path="/account/settings" element={<AccountSetting />} />

                        <Route
                            path="/application"
                            element={
                                // user ? <Navigate to="/auth" /> :
                                <ApplicationPage />
                            }
                        />





                        <Route path="/main" element={<MainPage />} >

                            <Route path="overview" element={<OverviewComponent />} />
                            {/* <Route path="average-time" element={<AverageTimeReport />} />
                            <Route path="behavior-metrics" element={<BehaviorMetricsReport />} />
                            <Route path="visit-history" element={<VisitHistoryReport />} />
                            <Route path="sales-analytics" element={<SalesAnalyticsReport />} /> 
                        </Route>

                        <Route path="/common-metrics" element={<h1>Общие метрики</h1>} />
                        <Route path="/time-metrics" element={<h1>Временные метрики</h1>} />
                        <Route path="/behavior-metrics" element={<h1>Метрики поведения</h1>} />
                        <Route path="/graphs-navigation" element={<h1>Графы и навигация</h1>} />
                        <Route path="/forecast-models" element={<h1>Модели прогнозов</h1>} />
                        <Route path="/experiments" element={<h1>Эксперименты</h1>} />



                    </Routes>

                </div>
            </div> */}






            <div
                className={`app-container ${user
                        ? isNavbarExpanded
                            ? "with-sidebar"
                            : "with-sidebar collapsed"
                        : "without-sidebar"
                    }`}
            >
                {user && (
                    <Sidebar
                        isExpanded={isNavbarExpanded}
                        toggleNavbar={toggleNavbar}
                    />
                )}
                <div className="main-content">
                    <Header
                    // user={user} 
                    />
                    <Routes>
                        <Route path="*" element={<UnknownPage />} />
                        <Route path="/" element={<PromoPage />} />
                        <Route path="/auth" element={<AuthPage />} />

                        <Route
                            path="/account"
                            element={
                                user ? <AccountPage /> : <Navigate to="/auth" />
                            }
                        >
                            <Route path="settings" element={<AccountSetting />} />
                        </Route>
                        <Route
                            path="/application"
                            element={
                                user ? <ApplicationPage /> : <Navigate to="/auth" />
                            }
                        />
                        <Route
                            path="/main"
                            element={user ? <MainPage /> : <Navigate to="/auth" />}
                        >
                            <Route path="overview" element={<OverviewComponent />} />
                        </Route>
                        <Route
                            path="/common-metrics"
                            element={user ? <h1>Общие метрики</h1> : <Navigate to="/auth" />}
                        />
                        <Route
                            path="/time-metrics"
                            element={user ? <h1>Временные метрики</h1> : <Navigate to="/auth" />}
                        />
                        <Route
                            path="/behavior-metrics"
                            element={user ? <h1>Метрики поведения</h1> : <Navigate to="/auth" />}
                        />
                        <Route
                            path="/graphs-navigation"
                            element={user ? <h1>Графы и навигация</h1> : <Navigate to="/auth" />}
                        />
                        <Route
                            path="/forecast-models"
                            element={user ? <h1>Модели прогнозов</h1> : <Navigate to="/auth" />}
                        />
                        <Route
                            path="/experiments"
                            element={user ? <h1>Эксперименты</h1> : <Navigate to="/auth" />}
                        />
                    </Routes>
                </div>
            </div>
        </div >
    );
};

export default App;
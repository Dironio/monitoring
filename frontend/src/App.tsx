import React, { useState } from 'react';
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
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAnalytics } from './hooks/useAnalytics';
import AverageTimeComponent from './components/Pages/MainPage/Components/AverageTimeComponent';
import MetricPage from './components/Pages/BehaviorMetricPage/BehaviorMetricPage';
import EventAnalysisComponent from './components/Pages/BehaviorMetricPage/Components/EventAnalysisComponents';
import InterfacePage from './components/Pages/InterfacePage/InterfacePage';
import HeatmapComponent from './components/Pages/InterfacePage/Components/HeatmapComponent';

//сделать компонент 404
const App: React.FC = () => {
    const [isNavbarExpanded, setIsNavbarExpanded] = useState<boolean>(() => {
        const savedState = localStorage.getItem("navbarExpanded");
        return savedState ? JSON.parse(savedState) : true;
    });
    const { user, loading } = useFetchUser();

    useAnalytics()

    console.log(user)

    if (loading) {//прорисовать страницу
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
            {/* 
                    <Routes>
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
                        user={user}
                    />
                    <div className="content-wrapper">
                        <Routes>
                            <Route path="*" element={<UnknownPage />} />
                            <Route path="/" element={<PromoPage />} />
                            <Route path="/auth" element={
                                user ? <Navigate to="/account" /> : <AuthPage />
                            } />


                            {/* НАДО ПОФИКСИТЬ, чет не работают */}
                            <Route
                                path="/account"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <AccountPage />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="settings" element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <AccountSetting />
                                    </ProtectedRoute>
                                } />
                            </Route>

                            <Route
                                path="/application"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <ApplicationPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/main"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <MainPage user={user} loading={loading} />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="overview" element={<OverviewComponent user={user} loading={loading} />} />
                                <Route path="average-time" element={<AverageTimeComponent user={user} loading={loading} />} />
                            </Route>

                            <Route
                                path="/metrics"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <MetricPage user={user} loading={loading} />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="event-analysis" element={<EventAnalysisComponent user={user} loading={loading} />} />

                            </Route>

                            <Route
                                path="/interface"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <InterfacePage user={user} loading={loading} />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="heatmap-page" element={<HeatmapComponent user={user} loading={loading} />} />
                                {/* <Route path="heatmap-scroll" element={<EventAnalysisComponent user={user} loading={loading} />} /> */}
                            </Route>





                            <Route
                                path="/graphs-navigation"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <h1>Графы и навигация</h1>
                                    </ProtectedRoute>
                                }
                            >
                                {/* <Route path="overview" element={<OverviewComponent user={user} loading={loading} />} />
                                <Route path="average-time" element={<AverageTimeComponent user={user} loading={loading} />} /> */}
                            </Route>



                            <Route
                                path="/time-metrics"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <h1>Временные метрики</h1>
                                    </ProtectedRoute>
                                }
                            />


                            <Route
                                path="/forecast-models"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <h1>Модели прогнозов</h1>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/experiments"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <h1>Эксперименты</h1>
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default App;
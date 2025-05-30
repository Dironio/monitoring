import React, { useState } from 'react';
import { useAnalytics } from './hooks/useAnalytics';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import './App.css'
import PromoPage from './components/Pages/PromoPage/PromoPage';
import Sidebar from './components/Navbar/Navbar';
import AuthPage from './components/Pages/AuthPage/AuthPage';
import ApplicationPage from './components/Pages/ApplicationPage/ApplicationPage';
import UnknownPage from './components/Pages/UnknowPage/UnknowPage';
import { useFetchUser } from './hooks/useCurrentUser';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AccountRoutes from './routes/AccountRoute';
import MainRouter from './routes/MainRoute';
import MetricsRouter from './routes/MetricsRoute';
import InterfaceRouter from './routes/InterfaceRoute';
import ModelsRouter from './routes/ModelsRoute';
import AnalyticsRouter from './routes/AnalyticsRoute';
import LoadingPage from './components/Pages/LoadingPage/LoadingPage';
import ExperiementRouter from './routes/ExperiementRoute';
import ConsentModal from './components/Modals/ConsentModal';
import RatingModal from './components/Modals/RatingModal';
// import DashboardPage from './components/Pages/DashboardPage/DashboardPage';

const App: React.FC = () => {
    const { user, loading } = useFetchUser();

    const [isNavbarExpanded, setIsNavbarExpanded] = useState<boolean>(() => {
        const savedState = localStorage.getItem("navbarExpanded");
        return savedState ? JSON.parse(savedState) : true;
    });

    const toggleNavbar = () => {
        setIsNavbarExpanded((prev) => {
            const newState = !prev;
            localStorage.setItem("navbarExpanded", JSON.stringify(newState));
            return newState;
        });
    };

    useAnalytics()


    if (loading) {
        return <LoadingPage />;
    }

    return (

        <div className="App">
            <ConsentModal />
            <ProtectedRoute user={user} loading={loading}>
                <RatingModal user={user} loading={loading} />
            </ProtectedRoute>
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
                            <Route path="/" element={<PromoPage user={user} loading={loading} />} />
                            <Route path="/auth" element={
                                user ? <Navigate to="/account" /> : <AuthPage />
                            } />

                            {/* <AccountRoutes user={user} loading={loading} />
                            <MainRouter user={user} loading={loading} />
                            <MetricsRouter user={user} loading={loading} />
                            <InterfaceRouter user={user} loading={loading} />
                            <ModelsRouter user={user} loading={loading} />
                            <AnalyticsRouter user={user} loading={loading} /> */}

                            {AccountRoutes({ user, loading })}
                            {MainRouter({ user, loading })}
                            {MetricsRouter({ user, loading })}
                            {InterfaceRouter({ user, loading })}
                            {ModelsRouter({ user, loading })}
                            {AnalyticsRouter({ user, loading })}
                            {ExperiementRouter({ user, loading })}


                            <Route
                                path="/time-metrics"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <h1>Временные метрики</h1>
                                    </ProtectedRoute>
                                }
                            />


                            {/* <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            /> */}

                            {/* <Route
                                path="/experiments"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <h1>Эксперименты</h1>
                                    </ProtectedRoute>
                                }
                            /> */}

                            {/* <Route
                                path="/application"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <ApplicationPage />
                                    </ProtectedRoute>
                                }
                            /> */}
                        </Routes>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default App;
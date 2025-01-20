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
import OverviewComponent from './components/Pages/MainPage/OverviewPage/OverviewComponent';
import UnknownPage from './components/Pages/UnknowPage/UnknowPage';
import { useFetchUser } from './hooks/useCurrentUser';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAnalytics } from './hooks/useAnalytics';
import AverageTimeComponent from './components/Pages/MainPage/AveragePage/AverageTimeComponent';
import MetricPage from './components/Pages/BehaviorMetricPage/BehaviorMetricPage';
import EventAnalysisComponent from './components/Pages/BehaviorMetricPage/Components/EventAnalysisComponents';
import InterfacePage from './components/Pages/InterfacePage/InterfacePage';
import HeatmapComponent from './components/Pages/InterfacePage/Components/HeatmapComponent';
import AccountSettings from './components/Pages/AccountPage/AccountSettings/AccountSetting';
import ModelsPage from './components/Pages/ModelsPage/ModelsPage';
import ClusteringComponent from './components/Pages/ModelsPage/ClusteringPage/ClusteringPage';
import BehaviorAnalysisPage from './components/Pages/BehaviorAnalysis/AnalysisPage';
import HistoryComponent from './components/Pages/MainPage/SessionHistoryPage/SessionHistoryComponent';
import HeatmapPage from './components/Pages/InterfacePage/Components/HeatmapPage';



//сделать компонент 404
const App: React.FC = () => {
    const [isNavbarExpanded, setIsNavbarExpanded] = useState<boolean>(() => {
        const savedState = localStorage.getItem("navbarExpanded");
        return savedState ? JSON.parse(savedState) : true;
    });
    const { user, loading } = useFetchUser();

    // useAnalytics()

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


                            <Route>
                                <Route
                                    path="/account"
                                    element={
                                        <ProtectedRoute user={user} loading={loading}>
                                            <AccountPage user={user} loading={loading} />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/account/settings"
                                    element={
                                        <ProtectedRoute user={user} loading={loading}>
                                            <AccountSettings user={user} loading={loading} />
                                        </ProtectedRoute>
                                    }
                                />
                                {/* <Route
                                    path="/account/main"
                                    element={
                                        <ProtectedRoute user={user} loading={loading}>
                                            <AccountMain user={user} loading={loading} />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/account/sales-analytics"
                                    element={
                                        <ProtectedRoute user={user} loading={loading}>
                                            <SalesAnalytics user={user} loading={loading} />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/account/sales"
                                    element={
                                        <ProtectedRoute user={user} loading={loading}>
                                            <Sales user={user} loading={loading} />
                                        </ProtectedRoute>
                                    }
                                /> */}
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
                                <Route path="visit-history" element={<HistoryComponent user={user} loading={loading} />} />
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
                                <Route path="heatmap-page" element={<HeatmapPage
                                // user={user} loading={loading} 
                                />} />
                                {/* <Route path="heatmap-scroll" element={<EventAnalysisComponent user={user} loading={loading} />} /> */}
                            </Route>

                            <Route
                                path="/models"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <ModelsPage user={user} loading={loading} />
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="clustering" element={<ClusteringComponent user={user} loading={loading} />} />
                            </Route>



                            <Route
                                path="/analytics"
                                element={
                                    <ProtectedRoute user={user} loading={loading}>
                                        <BehaviorAnalysisPage user={user} loading={loading} />
                                    </ProtectedRoute>
                                }
                            >
                                {/* <Route path="behavior-analysis" element={<BehaviorAnalysisComponent user={user} loading={loading} />} /> */}
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
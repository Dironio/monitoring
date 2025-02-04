import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './ModelsPage.css';
import SiteSelection from '../../UI/SiteSelection';
import { User } from '../../../models/user.model';
import ChipsNavigation from '../../UI/ChipsNavigation';
import { SiteContext } from '../../utils/SiteContext';
import LoadingPage from '../LoadingPage/LoadingPage';

interface ModelsPageProps {
    user: User | null;
    loading: boolean;
}

const ModelsPage: React.FC<ModelsPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedSite, setSelectedSite] = useState<{ value: number; label: string } | null>(() => {
        const savedSite = localStorage.getItem('selectedSite');
        return savedSite ? JSON.parse(savedSite) : null;
    });

    const navItems = [
        {
            path: 'clustering',
            label: 'Кластерный анализ',
            description: 'K-means кластеризация пользовательских сессий'
        },
        {
            path: 'sequence',
            label: 'Анализ последовательностей',
            description: 'DTW и Марковские цепи для анализа путей'
        },
        {
            path: 'similarity',
            label: 'Метрики сходства',
            description: 'Косинусное сходство и расстояние Левенштейна'
        },
        {
            path: 'time-series',
            label: 'Временные ряды',
            description: 'Декомпозиция рядов и ARIMA модели'
        },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        if (location.pathname === '/models') {
            navigate('clustering');
        }
    }, [location.pathname, navigate]);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <SiteContext.Provider
            value={{ selectedSite, setSelectedSite }}
        >
            <main className="main-page">
                <div className="wrapper-page">
                    {/* <div className="models-header"></div> */}

                    <ChipsNavigation
                        items={navItems}
                        onNavigate={handleNavigate}
                        currentPath={location.pathname.split('/').pop() || ''}
                        breakpoints={{
                            mobile: 480,
                            tablet: 768,
                            laptop: 1024,
                            desktop: 1280,
                        }}
                        visibleItems={{
                            mobile: 1,
                            tablet: 2,
                            laptop: 3,
                            desktop: 5,
                        }}
                    />
                    <div className="models__site-select">
                        <SiteSelection user={user} loading={loading} />
                    </div>

                    <section className="models-content">
                        {/* <div className="model-info">
                        {navItems.map(item => {
                            const isActive = location.pathname.includes(item.path);
                            if (isActive) {
                                return (
                                    <div key={item.path} className="model-description">
                                        <h2>{item.label}</h2>
                                        <p>{item.description}</p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div> */}
                        <div className="model-visualization">
                            <Outlet />
                        </div>
                    </section>
                </div>
            </main>
        </SiteContext.Provider>
    );
};

export default ModelsPage;

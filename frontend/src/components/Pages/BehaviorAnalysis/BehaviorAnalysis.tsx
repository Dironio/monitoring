import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './BehaviorAnalysisPage.css';
import SiteSelection from '../../UI/SiteSelection';
import { User } from '../../../models/user.model';
import ChipsNavigation from '../../UI/ChipsNavigation';

interface BehaviorAnalysisPageProps {
    user: User | null;
    loading: boolean;
}

const BehaviorAnalysisPage: React.FC<BehaviorAnalysisPageProps> = ({ user, loading }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    const navItems = [
        {
            path: 'behavior-groups',
            label: 'Поведенческие группы',
            description: 'Кластерный анализ сессий и метрики групп'
        },
        {
            path: 'interaction-scenarios',
            label: 'Сценарии взаимодействия',
            description: 'Анализ последовательностей действий и Марковские цепи'
        },
        {
            path: 'decision-points',
            label: 'Точки принятия решений',
            description: 'Анализ критических моментов и их эффективности'
        },
        {
            path: 'behavior-anomalies',
            label: 'Аномалии поведения',
            description: 'Выявление и классификация отклонений'
        },
        {
            path: 'analytics-report',
            label: 'Отчётность',
            description: 'Комплексный анализ и визуализация данных'
        }
    ];

    const periodOptions = [
        { value: 'day', label: 'День' },
        { value: 'week', label: 'Неделя' },
        { value: 'month', label: 'Месяц' },
        { value: 'quarter', label: 'Квартал' }
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    useEffect(() => {
        if (location.pathname === '/behavior-analysis') {
            navigate('behavior-groups');
        }
    }, [location.pathname, navigate]);

    return (
        <main className="behavior-analysis-page">
            <div className="wrapper-page">
                <div className="behavior-header">
                    <h1 className="behavior-title">Анализ поведения пользователей</h1>
                    <div className="behavior-controls">
                        <div className="period-selector">
                            <label>Период анализа:</label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                className="period-select"
                            >
                                {periodOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <SiteSelection user={user} loading={loading} />
                    </div>
                </div>

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

                <section className="behavior-content">
                    <div className="section-info">
                        {navItems.map(item => {
                            const isActive = location.pathname.includes(item.path);
                            if (isActive) {
                                return (
                                    <div key={item.path} className="section-description">
                                        <h2>{item.label}</h2>
                                        <p>{item.description}</p>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                    <div className="section-content">
                        <Outlet context={{ selectedPeriod }} />
                    </div>
                </section>

                <div className="interactive-controls">
                    <button className="control-button">
                        <span className="icon"></span>
                        Детализация
                    </button>
                    <button className="control-button">
                        <span className="icon"></span>
                        Сравнение периодов
                    </button>
                    <button className="control-button">
                        <span className="icon"></span>
                        Экспорт данных
                    </button>
                </div>
            </div>
        </main>
    );
};

export default BehaviorAnalysisPage;

// components/AnalysisRecommendations.tsx
import React from 'react';
import { AnalysisRecommendation, ClusterData, TemporalData } from '../../../../models/cluster.model';

interface AnalysisRecommendationsProps {
    clusterData: ClusterData;
    temporalData: TemporalData[];
}

export const AnalysisRecommendations: React.FC<AnalysisRecommendationsProps> = ({
    clusterData,
    temporalData
}) => {
    const calculatePeakPeriods = (data: TemporalData[]): string => {
        if (!data || data.length === 0) return '';

        const avg = data.reduce((sum: number, item: TemporalData) => sum + item.event_count, 0) / data.length;
        const peaks = data.filter(item => item.event_count > avg * 1.5)
            .map(item => new Date(item.time_bucket).toLocaleTimeString());

        return peaks.length > 0 ? peaks.join(', ') : 'равномерное распределение';
    };

    const generateRecommendations = (): AnalysisRecommendation => {
        const silhouetteScore = clusterData.metrics.silhouetteScore;
        const clusterCount = clusterData.clusters.length;
        const avgEventsPerHour = temporalData.reduce((sum, item) => sum + item.event_count, 0) / temporalData.length;

        if (silhouetteScore > 0.7) {
            return {
                type: 'positive',
                title: 'Высокое качество кластеризации',
                description: `Выявлено ${clusterCount} чётких поведенческих паттернов`,
                recommendations: [
                    'Создать персонализированные пути пользователей для каждого кластера',
                    'Оптимизировать интерфейс под выявленные паттерны поведения',
                    'Внедрить A/B тестирование для различных кластеров'
                ]
            };
        } else if (silhouetteScore > 0.4) {
            return {
                type: 'neutral',
                title: 'Средняя выраженность паттернов',
                description: 'Обнаружены пересекающиеся поведенческие группы',
                recommendations: [
                    'Провести дополнительный анализ пограничных случаев',
                    'Уточнить параметры кластеризации',
                    'Собрать дополнительные метрики взаимодействия'
                ]
            };
        } else {
            return {
                type: 'negative',
                title: 'Слабая кластеризация',
                description: 'Поведенческие паттерны слабо выражены',
                recommendations: [
                    'Пересмотреть метрики сбора данных',
                    'Увеличить период анализа',
                    'Проверить качество данных'
                ]
            };
        }
    };

    return (
        <section className="analysis">
            <div className="analysis__section">
                <h3 className="analysis__title">Паттерны взаимодействия</h3>
                <p className="analysis__text">
                    На основе кластерного анализа выявлено {clusterData?.clusters.length} основных
                    паттернов поведения пользователей. Каждый кластер представляет собой группу
                    пользователей со схожими характеристиками взаимодействия.
                </p>
            </div>
            <div className="analysis__section">
                <h3 className="analysis__title">Временные тенденции</h3>
                <p className="analysis__text">
                    Анализ временных рядов показывает {
                        temporalData?.length > 0 ?
                            `пики активности в периоды ${calculatePeakPeriods(temporalData)}` :
                            'различные периоды активности пользователей'
                    }.
                </p>
            </div>
            <div className="analysis__section">
                <h3 className="analysis__title">Рекомендации</h3>
                <ul className="analysis__list">
                    <li>Оптимизировать интерфейс для наиболее активных кластеров</li>
                    <li>Учитывать временные паттерны при планировании обновлений</li>
                    <li>Исследовать причины формирования отдельных кластеров</li>
                </ul>
            </div>
        </section>
    );
};

export default AnalysisRecommendations;
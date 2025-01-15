import React from 'react';
import { Trend } from '../mainHooks/useOverviewMetrics';

interface TrendDescriptionProps {
    trend: Trend;
    metric: 'users' | 'time';
    currentValue: string | number;
}

export const TrendDescription: React.FC<TrendDescriptionProps> = ({ trend, metric, currentValue }) => {
    return (
        <div className="trend-description">
            <p>
                {metric === 'users' ? 'Количество активных пользователей' : 'Среднее время на сайте'}
                {trend.trend === 'рост' && <span className="trend-up"> растёт</span>}
                {trend.trend === 'падение' && <span className="trend-down"> падает</span>}
                {trend.trend === 'стабильность' && <span className="trend-stable"> остаётся стабильным</span>}
                {trend.percentage > 0 && ` на ${trend.percentage}%`}.
            </p>
            <p>Текущее значение: <strong>{currentValue}</strong></p>
        </div>
    );
};

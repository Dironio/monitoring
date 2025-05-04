import { UMAPPoint } from "./UmapTypes";

interface AnalysisResultsProps {
    data: UMAPPoint[];
    userSegments: Record<string, string>;
}

export const AnalysisResults = ({ data, userSegments }: AnalysisResultsProps) => {
    if (data.length === 0) return <div className="analysis-results__empty">Нет данных для анализа</div>;

    const scrollEvents = data.filter(p => p.eventType === 'scroll');
    const clickEvents = data.filter(p => p.eventType === 'click');
    const sequenceEvents = data.filter(p => p.pageUrl.includes('sequence'));
    const similarityEvents = data.filter(p => p.pageUrl.includes('similarity'));

    // Статистика по сегментам
    const segmentCounts = data.reduce((acc, point) => {
        acc[point.userSegment] = (acc[point.userSegment] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="analysis-results">
            <h3 className="analysis-results__title">Результаты анализа</h3>

            <div className="analysis-results__section">
                <h4 className="analysis-results__subtitle">Общая статистика</h4>
                <ul className="analysis-results__list">
                    <li className="analysis-results__item">
                        <strong>Всего событий:</strong> {data.length}
                    </li>
                    <li className="analysis-results__item">
                        <strong>Прокрутки:</strong> {scrollEvents.length}
                    </li>
                    <li className="analysis-results__item">
                        <strong>Клики:</strong> {clickEvents.length}
                    </li>
                    <li className="analysis-results__item">
                        <strong>События модели sequence:</strong> {sequenceEvents.length}
                    </li>
                    <li className="analysis-results__item">
                        <strong>События модели similarity:</strong> {similarityEvents.length}
                    </li>
                    <li className="analysis-results__item">
                        <strong>Средние координаты:</strong>
                        X: {(data.reduce((a, p) => a + p.x, 0) / data.length).toFixed(2)},
                        Y: {(data.reduce((a, p) => a + p.y, 0) / data.length).toFixed(2)}
                    </li>
                </ul>
            </div>

            <div className="analysis-results__section">
                <h4 className="analysis-results__subtitle">Сегменты пользователей</h4>
                <ul className="analysis-results__list">
                    {Object.entries(segmentCounts).map(([segment, count]) => (
                        <li key={segment} className="analysis-results__item">
                            <strong>{segment}:</strong> {count} ({Math.round(count / data.length * 100)}%)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
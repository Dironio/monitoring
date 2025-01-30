import { useEffect, useState } from "react";
import { useSiteContext } from "../../../../utils/SiteContext";
import './SurveysPage.css';

interface SurveyData {
    rating: number;
    count: number;
    percentage: number;
}

const SurveysPage: React.FC = () => {
    const { selectedSite } = useSiteContext();
    const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
    const [statistics, setStatistics] = useState<SurveyData[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalResponses, setTotalResponses] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        if (selectedSurveyId) {
            fetchStatistics(selectedSurveyId);
        }
    }, [selectedSurveyId]);

    const fetchStatistics = async (surveyId: number) => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/events', {
                params: {
                    event_id: 25,
                    survey_id: surveyId
                }
            });

            const ratingCounts = data.reduce((acc: Record<number, number>, event: any) => {
                const rating = event.event_data.rating;
                acc[rating] = (acc[rating] || 0) + 1;
                return acc;
            }, {});

            const total = Object.values(ratingCounts).reduce((sum: number, count: number) => sum + count, 0);
            const avg = data.reduce((sum: number, event: any) => sum + event.event_data.rating, 0) / total;

            const statsData = Object.entries(ratingCounts).map(([rating, count]) => ({
                rating: Number(rating),
                count: count as number,
                percentage: ((count as number) / total) * 100,
                fill: `hsl(var(--chart-${Number(rating)}))`
            }));

            setStatistics(statsData);
            setTotalResponses(total);
            setAverageRating(Number(avg.toFixed(2)));
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="survey-statistics">
            <div className="survey-statistics__header">
                <h1 className="survey-statistics__title">Статистика опросов</h1>
                <div className="survey-statistics__selector">
                    <SurveySelector onSelect={setSelectedSurveyId} />
                </div>
            </div>

            {loading ? (
                <div className="survey-statistics__loading">
                    <span className="survey-statistics__loading-text">Загрузка данных...</span>
                </div>
            ) : selectedSurveyId ? (
                <>
                    <div className="survey-statistics__cards">
                        <div className="survey-statistics__card">
                            <div className="survey-statistics__card-header">
                                <h2 className="survey-statistics__card-title">Всего ответов</h2>
                            </div>
                            <div className="survey-statistics__card-value">{totalResponses}</div>
                        </div>
                        <div className="survey-statistics__card">
                            <div className="survey-statistics__card-header">
                                <h2 className="survey-statistics__card-title">Средняя оценка</h2>
                            </div>
                            <div className="survey-statistics__card-value">{averageRating}</div>
                        </div>
                    </div>

                    <div className="survey-statistics__chart-container">
                        <h2 className="survey-statistics__card-title">Распределение оценок</h2>
                        <div className="survey-statistics__chart">
                            <ResponsiveContainer>
                                <BarChart data={statistics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rating" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        name="Количество ответов"
                                        className={({ rating }) => `chart-bar chart-bar--${rating}`}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="survey-statistics__table-container">
                        <table className="survey-statistics__table">
                            <thead className="survey-statistics__table-header">
                                <tr>
                                    <th className="survey-statistics__table-header-cell">Оценка</th>
                                    <th className="survey-statistics__table-header-cell">Количество</th>
                                    <th className="survey-statistics__table-header-cell">Процент</th>
                                </tr>
                            </thead>
                            <tbody className="survey-statistics__table-body">
                                {statistics.map((stat) => (
                                    <tr key={stat.rating} className="survey-statistics__table-row">
                                        <td className="survey-statistics__table-cell">{stat.rating}</td>
                                        <td className="survey-statistics__table-cell">{stat.count}</td>
                                        <td className="survey-statistics__table-cell">
                                            {stat.percentage.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="survey-statistics__loading">
                    <span className="survey-statistics__loading-text">
                        Выберите опрос для просмотра статистики
                    </span>
                </div>
            )}
        </div>
    );
};

export default SurveysPage;
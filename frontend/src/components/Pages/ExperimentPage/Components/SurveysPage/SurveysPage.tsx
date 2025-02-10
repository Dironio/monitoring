import { useEffect, useState } from "react";
import { useSiteContext } from "../../../../utils/SiteContext";
import './SurveysPage.css';
import SurveySelector from "../../../../UI/SurveysSelection";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface SurveyData {
    rating: number;
    count: number;
    percentage: number;
}

interface SurveyResponse {
    user_id: number;
    rating: number;
    user_agent_string: string;
    created_at: string;
}

const SurveysPage: React.FC = () => {
    const { selectedSite } = useSiteContext();
    const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
    const [statistics, setStatistics] = useState<SurveyData[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalResponses, setTotalResponses] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    const fetchStatistics = async (surveyId: number) => {
        if (!selectedSite?.value || !surveyId) {
            return;
        }

        setLoading(true);
        try {
            const response = await getAPI.get<SurveyResponse[]>(
                `/events/experiement/survey-statistics?web_id=${selectedSite.value}&survey_id=${surveyId}`
            );

            const ratingCounts = response.data.reduce((acc, curr) => {
                acc[curr.rating] = (acc[curr.rating] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const total = response.data.length;
            setTotalResponses(total);

            const sum = response.data.reduce((acc, curr) => acc + curr.rating, 0);
            const avg = total > 0 ? sum / total : 0;
            setAverageRating(Number(avg.toFixed(1)));

            const stats: SurveyData[] = Object.entries(ratingCounts).map(([rating, count]) => ({
                rating: Number(rating),
                count,
                percentage: (count / total) * 100
            }));

            stats.sort((a, b) => a.rating - b.rating);
            setStatistics(stats);

        } catch (error) {
            console.error('Error fetching statistics:', error);
            setStatistics([]);
            setTotalResponses(0);
            setAverageRating(0);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="survey-statistics">
            <div className="survey-statistics__header">
                <h1 className="survey-statistics__title">Статистика опросов</h1>
                <div className="survey-statistics__selector">
                    <SurveySelector
                        onChange={(surveyId) => setSelectedSurveyId(surveyId)}
                        disabled={loading}
                    />
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
                        <h2 className="survey-statistics__chart-title">Распределение оценок</h2>
                        <div className="survey-statistics__chart">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statistics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="rating"
                                        label={{ value: 'Оценка', position: 'bottom' }}
                                    />
                                    <YAxis
                                        label={{ value: 'Количество ответов', angle: -90, position: 'insideLeft' }}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => [value, 'Количество ответов']}
                                        labelFormatter={(label) => `Оценка: ${label}`}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#3B82F6"
                                        name="Количество ответов"
                                    >
                                        {statistics.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`hsl(${(entry.rating * 20)}, 70%, 50%)`}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="survey-statistics__table-container">
                        <table className="survey-statistics__table">
                            <thead>
                                <tr>
                                    <th>Оценка</th>
                                    <th>Количество</th>
                                    <th>Процент</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statistics.map((stat) => (
                                    <tr key={stat.rating}>
                                        <td>{stat.rating}</td>
                                        <td>{stat.count}</td>
                                        <td>{stat.percentage.toFixed(1)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="survey-statistics__empty">
                    <span>Выберите опрос для просмотра статистики</span>
                </div>
            )}
        </div>
    );
};

export default SurveysPage;
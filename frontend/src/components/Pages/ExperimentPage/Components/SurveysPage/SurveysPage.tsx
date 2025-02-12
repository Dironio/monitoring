import { useEffect, useState } from "react";
import { useSiteContext } from "../../../../utils/SiteContext";
import './SurveysPage.css';
import { format } from 'date-fns';
import SurveySelector from "../../../../UI/SurveysSelection";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAPI } from "../../../../utils/axiosGet";

interface SurveyData {
    rating: number;
    count: number;
    percentage: number;
}

interface Browser {
    name: string;
    version: string;
}

interface UserAgent {
    browser: Browser;
    os: string;
    device: string;
}

export interface SurveyResponse {
    user_id: number;
    rating: number;
    user_agent_string: string;
    created_at: string;
    user_agent: UserAgent;
}

export interface SurveyStatistic {
    rating: number;
    count: number;
    percentage: number;
}

const SurveysPage: React.FC = () => {
    const { selectedSite, selectedSurvey } = useSiteContext();
    const [responses, setResponses] = useState<SurveyResponse[]>([]);
    const [statistics, setStatistics] = useState<SurveyStatistic[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalResponses, setTotalResponses] = useState<number>(0);
    const [averageRating, setAverageRating] = useState<number>(0);

    const calculateStatistics = (data: SurveyResponse[]): void => {
        const total = data.length;
        setTotalResponses(total);

        if (total > 0) {
            const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
            setAverageRating(Number((sum / total).toFixed(1)));

            const ratingGroups: { [key: number]: SurveyResponse[] } = data.reduce((acc, curr) => {
                if (!acc[curr.rating]) {
                    acc[curr.rating] = [];
                }
                acc[curr.rating].push(curr);
                return acc;
            }, {} as { [key: number]: SurveyResponse[] });

            const stats: SurveyStatistic[] = Object.entries(ratingGroups).map(([rating, responses]) => ({
                rating: Number(rating),
                count: responses.length,
                percentage: Number(((responses.length / total) * 100).toFixed(1)),
                responses: responses.map(r => ({
                    created_at: r.created_at,
                    user_agent_string: r.user_agent_string
                }))
            }));

            setStatistics(stats.sort((a, b) => a.rating - b.rating));
        } else {
            setStatistics([]);
            setAverageRating(0);
        }
    };

    const formatDate = (dateString: string): string => {
        return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    };

    const fetchSurveyData = async (): Promise<void> => {
        if (!selectedSite?.value || !selectedSurvey) {
            return;
        }

        setLoading(true);
        try {
            const response = await getAPI.get<SurveyResponse[]>(
                `/events/experiement/survey-votes?web_id=${selectedSite.value}&survey_id=${selectedSurvey}`
            );

            setResponses(response.data);
            calculateStatistics(response.data);
        } catch (error) {
            console.error('Error fetching survey data:', error);
            setResponses([]);
            setStatistics([]);
            setTotalResponses(0);
            setAverageRating(0);
        } finally {
            setLoading(false);
        }
    };

    const getDeviceIcon = (device: string) => {
        switch (device.toLowerCase()) {
            case 'desktop':
                return <img src="/assets/desktop.svg" alt="desktop" className="surveys-page__device-icon" />;
            case 'mobile':
                return <img src="/assets/mobile.svg" alt="mobile" className="surveys-page__device-icon" />;
            case 'tablet':
                return <img src="/assets/tablet.svg" alt="tablet" className="surveys-page__device-icon" />;
            default:
                return null;
        }
    };

    const formatBrowser = (browser: Browser) => {
        return `${browser.name} ${browser.version}`;
    };

    useEffect(() => {
        fetchSurveyData();
    }, [selectedSite, selectedSurvey]);



    const renderBarChart = (): JSX.Element => (
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
                    formatter={(value: number) => [`${value} ответов`, 'Количество']}
                    labelFormatter={(label) => `Оценка: ${label}`}
                />
                <Bar dataKey="count" name="Количество ответов">
                    {statistics.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${entry.rating * 20}, 70%, 50%)`}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
    // const { selectedSite } = useSiteContext();
    // const [selectedSurveyId, setSelectedSurveyId] = useState<number | null>(null);
    // const [statistics, setStatistics] = useState<SurveyData[]>([]);
    // const [loading, setLoading] = useState(false);
    // const [totalResponses, setTotalResponses] = useState(0);
    // const [averageRating, setAverageRating] = useState(0);

    // const fetchStatistics = async (surveyId: number) => {
    //     if (!selectedSite?.value || !surveyId) {
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const response = await getAPI.get<SurveyResponse[]>(
    //             `/events/experiement/survey-statistics?web_id=${selectedSite.value}&survey_id=${surveyId}`
    //         );

    //         const ratingCounts = response.data.reduce((acc, curr) => {
    //             acc[curr.rating] = (acc[curr.rating] || 0) + 1;
    //             return acc;
    //         }, {} as Record<number, number>);

    //         const total = response.data.length;
    //         setTotalResponses(total);

    //         const sum = response.data.reduce((acc, curr) => acc + curr.rating, 0);
    //         const avg = total > 0 ? sum / total : 0;
    //         setAverageRating(Number(avg.toFixed(1)));

    //         const stats: SurveyData[] = Object.entries(ratingCounts).map(([rating, count]) => ({
    //             rating: Number(rating),
    //             count,
    //             percentage: (count / total) * 100
    //         }));

    //         stats.sort((a, b) => a.rating - b.rating);
    //         setStatistics(stats);

    //     } catch (error) {
    //         console.error('Error fetching statistics:', error);
    //         setStatistics([]);
    //         setTotalResponses(0);
    //         setAverageRating(0);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="surveys-page">
            <h1 className="surveys-page__title">Статистика опросов</h1>

            {loading ? (
                <div className="surveys-page__loading">
                    <span className="surveys-page__loading-text">Загрузка данных...</span>
                </div>
            ) : selectedSurvey ? (
                <>
                    <div className="surveys-page__cards">
                        <div className="surveys-page__card">
                            <div className="surveys-page__card-header">
                                <h2 className="surveys-page__card-title">Всего ответов</h2>
                            </div>
                            <div className="surveys-page__card-value">{totalResponses}</div>
                        </div>
                        <div className="surveys-page__card">
                            <div className="surveys-page__card-header">
                                <h2 className="surveys-page__card-title">Средняя оценка</h2>
                            </div>
                            <div className="surveys-page__card-value">{averageRating}</div>
                        </div>
                    </div>

                    <div className="surveys-page__chart">
                        <h2 className="surveys-page__chart-title">Распределение оценок</h2>
                        <div className="surveys-page__chart-container">
                            {renderBarChart()}
                        </div>
                    </div>

                    <div className="surveys-page__table">
                        <table className="surveys-page__table-content">
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
                                        <td>{stat.percentage}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="surveys-page__table">
                        <div className="surveys-page__table-header">
                            <h2 className="surveys-page__table-title">История ответов</h2>
                        </div>
                        <div className="surveys-page__table-wrapper">
                            <table className="surveys-page__table-content">
                                <thead>
                                    <tr>
                                        <th>Дата и время</th>
                                        <th>Оценка</th>
                                        <th>Количество оценок</th>
                                        <th>Процент</th>
                                        <th>Устройство</th>
                                        <th>Браузер</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {responses
                                        .sort((a, b) =>
                                            new Date(b.created_at).getTime() -
                                            new Date(a.created_at).getTime()
                                        )
                                        .map((response, index) => {
                                            const stat = statistics.find(s => s.rating === response.rating);
                                            return (
                                                <tr key={index}>
                                                    <td>{formatDate(response.created_at)}</td>
                                                    <td>{response.rating}</td>
                                                    <td>{stat?.count || 0}</td>
                                                    <td>{stat?.percentage || 0}%</td>
                                                    <td className="surveys-page__device-cell">
                                                        {response.user_agent.device === 'Desktop' ? (
                                                            <div className="surveys-page__device-info">
                                                                {getDeviceIcon(response.user_agent.device)}
                                                                <span>{response.user_agent.os}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="surveys-page__device-info">
                                                                {getDeviceIcon(response.user_agent.device)}
                                                                <span>{response.user_agent.device}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>{formatBrowser(response.user_agent.browser)}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="surveys-page__empty">
                    <span>Выберите опрос для просмотра статистики</span>
                </div>
            )}
        </div>
    );
};

export default SurveysPage;
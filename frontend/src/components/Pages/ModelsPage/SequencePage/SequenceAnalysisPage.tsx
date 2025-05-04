import { useEffect, useState } from "react";
import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import { useSiteContext } from "../../../utils/SiteContext";
import './SequenceAnalysisPage.css'
import { PathDetails, PathSequence, SequenceAnalysis } from "../../../../models/sequence.model";
import { getAPI } from "../../../utils/axiosGet";
import { TransitionsVisualization } from "./utils/sankeyProccessData";


const SequenceAnalysisPage: React.FC = () => {
    const [data, setData] = useState<SequenceAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedSite } = useSiteContext();

    const fetchSequenceData = async () => {
        console.log('Starting fetchSequenceData');
        if (!selectedSite) {
            setError('Сайт не выбран');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await getAPI.get<SequenceAnalysis>(
                `/events/sequence/analysis?web_id=${selectedSite.value}`
            );

            if (!response.data) {
                throw new Error('Нет данных от сервера');
            }

            const commonPaths: PathSequence[] = response.data.clusters
                .filter(cluster => cluster.paths && cluster.paths.length > 0)
                .map(cluster => ({
                    path: cluster.paths[0],
                    frequency: cluster.sessionsCount,
                    avgDuration: cluster.avgDuration
                }))
                .sort((a, b) => b.frequency - a.frequency);

            const pathDetailsMap = new Map<string, PathDetails>();
            response.data.clusters.forEach(cluster => {
                cluster.commonTransitions.forEach(transition => {
                    const key = `${transition.from}|${transition.to}`;
                    const existing = pathDetailsMap.get(key);
                    if (existing) {
                        existing.count += transition.count;
                        existing.avgDuration = (existing.avgDuration + cluster.avgDuration) / 2;
                    } else {
                        pathDetailsMap.set(key, {
                            from: transition.from,
                            to: transition.to,
                            count: transition.count,
                            avgDuration: cluster.avgDuration
                        });
                    }
                });
            });

            const pathDetails = Array.from(pathDetailsMap.values())
                .sort((a, b) => b.count - a.count);

            const processedData: SequenceAnalysis = {
                totalSessions: response.data.totalSessions,
                clustersCount: response.data.clustersCount,
                averageSimilarity: response.data.averageSimilarity,
                clusters: response.data.clusters,
                commonPaths: commonPaths,
                pathDetails: pathDetails
            };

            console.log('Processed data:', {
                totalSessions: processedData.totalSessions,
                clustersCount: processedData.clustersCount,
                commonPathsCount: commonPaths.length,
                pathDetailsCount: pathDetails.length,
                sample: {
                    commonPath: commonPaths[0],
                    pathDetail: pathDetails[0]
                }
            });

            setData(processedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching sequence data:', err);
            if (err instanceof Error) {
                setError(`Ошибка при загрузке данных: ${err.message}`);
            } else {
                setError('Неизвестная ошибка при загрузке данных');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSite) {
            fetchSequenceData();
        }
    }, [selectedSite]);

    useEffect(() => {
        if (data) {
            console.log('Data state updated:', {
                totalSessions: data.totalSessions,
                clustersCount: data.clustersCount,
                averageSimilarity: data.averageSimilarity,
                hasClusters: data.clusters.length > 0,
                hasCommonPaths: data.commonPaths.length > 0,
                // hasPathDetails: data.pathDetails?.length > 0
            });
        }
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No data available</div>;

    return (
        <div className="sequence-analysis">
            <div className="sequence-analysis__graph">
                {data && <TransitionsVisualization data={data} />}
            </div>

            <div className="">
                {data.commonPaths && data.commonPaths.length > 0 && (
                    <section className="common-paths">
                        <h3>Популярные последовательности страниц</h3>
                        <div className="paths-list">
                            {data.commonPaths.map((path, index) => (
                                <div key={index} className="path-item">
                                    <div className="path-sequence">
                                        {Array.isArray(path.path) ? path.path.join(' → ') : ''}
                                    </div>
                                    <div className="path-stats">
                                        <span>Частота: {path.frequency || 0}</span>
                                        <span>Ср. длительность: {Math.round(path.avgDuration || 0)}с</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                <div className="sequence-analysis__description">
                    {data.pathDetails && data.pathDetails.length > 0 && (
                        <section className="path-details">
                            <h3>Детали переходов</h3>
                            <table className="transitions-table">
                                <thead>
                                    <tr>
                                        <th>Откуда</th>
                                        <th>Куда</th>
                                        <th>Количество</th>
                                        <th>Ср. длительность</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.pathDetails.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{detail.from}</td>
                                            <td>{detail.to}</td>
                                            <td>{detail.count}</td>
                                            <td>{Math.round(detail.avgDuration)}с</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SequenceAnalysisPage;
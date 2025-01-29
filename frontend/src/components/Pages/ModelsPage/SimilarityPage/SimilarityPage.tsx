import { useEffect, useState } from 'react';
import { useSiteContext } from '../../../utils/SiteContext';
import './SimilarityPage.css';
import { Bar, CartesianGrid, Legend, Line, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, LineChart, PieChart } from 'recharts';
import { DeviceMetrics, GeoMetrics, PageSimilarity, SessionSimilarity } from '../../../../models/similarity.model';
import similarityService from './utils/fetchData';

const SimilarityPage: React.FC = () => {
    const { selectedSite } = useSiteContext();
    const [data, setData] = useState<{
        sessions: SessionSimilarity[];
        geo: GeoMetrics[];
        pages: PageSimilarity[];
        devices: DeviceMetrics[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSite) return;

            try {
                setLoading(true);
                const response = await similarityService.fetchSimilarityData(selectedSite.value);
                setData(response);
            } catch (error) {
                console.error('Error fetching similarity data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSite]);

    if (loading) {
        return <div className="similarity-analytics__loader">Загрузка...</div>;
    }

    return (
        <div className="similarity-analytics">
            <div className="similarity-analytics__section">
                <h2 className="similarity-analytics__title">Session Similarity Matrix</h2>
                <div className="similarity-analytics__chart">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data?.sessions || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="session_a" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="similarity_score" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="similarity-analytics__section">
                <h2 className="similarity-analytics__title">Device Distribution</h2>
                <div className="similarity-analytics__chart">
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={data?.devices || []}
                                dataKey="session_count"
                                nameKey="os"
                                fill="#82ca9d"
                            />
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="similarity-analytics__section">
                <h2 className="similarity-analytics__title">Page Transitions</h2>
                <div className="similarity-analytics__chart">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data?.pages || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="source_url" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="transition_count" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default SimilarityPage;
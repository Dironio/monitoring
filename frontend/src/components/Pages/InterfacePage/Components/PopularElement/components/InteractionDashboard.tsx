import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Typography, Row, Col, Tag, Spin, Modal } from 'antd';
import { Heatmap } from '@ant-design/plots';
import ElementDetailsModal from './ElementDetailsModal';
import ClickDetailsModal from './ClickDetailsModal';
import {
    TimeRange,
    ElementStat,
    HeatmapCell,
    ElementDetails,
    ClickDetails
} from './interactionTypes';
import './InteractionDashboard.css';
import { useSiteContext } from '../../../../../utils/SiteContext';
import { getAPI } from '../../../../../utils/axiosGet';
import HeatmapTableVisualization from './HeatmapTableVisualization';
import ElementStatsTable from './ElementStatsTable';

const { Title, Text } = Typography;

const InteractionDashboard: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [elementStats, setElementStats] = useState<ElementStat[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [selectedElement, setSelectedElement] = useState<ElementDetails | null>(null);
    const [selectedCell, setSelectedCell] = useState<ClickDetails | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSite) return;

            setLoading(true);
            try {
                const [stats, heatmap] = await Promise.all([
                    getAPI.get<{ data: ElementStat[] }>(`/interface/element-stats?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&details=true`),
                    getAPI.get<{ data: HeatmapCell[] }>(`/interface/heatmap?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&details=true`)
                ]);

                setElementStats(stats.data.data);
                setHeatmapData(heatmap.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSite, selectedPage, timeRange]);

    const handleElementClick = async (elementType: string) => {
        const { data } = await getAPI.get<{ data: ElementDetails }>(`/interface/element-details?web_id=${selectedSite?.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&element_type=${elementType}`);
        setSelectedElement(data.data);
    };

    const handleCellClick = async (cell: HeatmapCell) => {
        const { data } = await getAPI.get<{ data: ClickDetails }>(`/interface/click-details?web_id=${selectedSite?.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&x=${cell.x}&y=${cell.y}`);
        setSelectedCell(data.data);
    };

    return (
        <div className="dashboard-container">
            <Card
                title={<Title level={4}>Аналитика взаимодействий: {selectedPage?.label || 'Весь сайт'}</Title>}
                extra={
                    <Select<TimeRange>
                        value={timeRange}
                        onChange={(value) => setTimeRange(value)}
                        style={{ width: 150 }}
                        disabled={loading}
                    >
                        <Select.Option value="24h">24 часа</Select.Option>
                        <Select.Option value="7d">7 дней</Select.Option>
                        <Select.Option value="30d">30 дней</Select.Option>
                    </Select>
                }
            >
                <Spin spinning={loading}>
                    <HeatmapTableVisualization
                        data={heatmapData}
                        onCellClick={handleCellClick}
                        pageUrl={selectedPage?.value}
                    />

                    <ElementStatsTable
                        data={elementStats}
                        onRowClick={handleElementClick}
                    />
                </Spin>
            </Card>

            <ElementDetailsModal
                element={selectedElement}
                onClose={() => setSelectedElement(null)}
            />

            <ClickDetailsModal
                cell={selectedCell}
                onClose={() => setSelectedCell(null)}
            />
        </div>
    );
};

export default InteractionDashboard;
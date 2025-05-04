import React, { useState, useEffect } from 'react';
import { Card, Select, Typography, Spin, Alert } from 'antd';
import ElementStatsTable from './ElementStatsTable';
import ElementDetailsModal from './ElementDetailsModal';
import ClickDetailsModal from './ClickDetailsModal';
import { TimeRange, ElementStat, HeatmapCell } from './interactionTypes';
import './InteractionDashboard.css';
import { useSiteContext } from '../../../../../utils/SiteContext';
import { getAPI } from '../../../../../utils/axiosGet';
import HeatmapTableVisualization from './HeatmapTableVisualization';

const { Title } = Typography;

const InteractionDashboard: React.FC = () => {
    const { selectedSite, selectedPage } = useSiteContext();
    const [elementStats, setElementStats] = useState<ElementStat[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSite) return;

            setLoading(true);
            try {
                // Получаем данные
                const [statsResponse, heatmapResponse] = await Promise.all([
                    getAPI.get<ElementStat[]>(
                        `/events/interface/element-stats?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&details=true`
                    ),
                    getAPI.get<HeatmapCell[]>(
                        `/events/interface/heatmap?web_id=${selectedSite.value}&page_url=${encodeURIComponent(selectedPage?.value || '')}&range=${timeRange}&details=true`
                    )
                ]);

                console.log('Ответ stats API:', statsResponse);
                console.log('Ответ heatmap API:', heatmapResponse);

                // Получаем данные из ответа API
                const statsData = statsResponse.data;
                const heatmapData = heatmapResponse.data;

                console.log('Данные stats:', statsData);
                console.log('Данные heatmap:', heatmapData);

                // Преобразуем строковые значения в числовые
                const processedHeatmapData: HeatmapCell[] = Array.isArray(heatmapData)
                    ? heatmapData.map(item => ({
                        x: item.x,
                        y: item.y,
                        count: typeof item.count === 'string' ? parseInt(item.count, 10) : item.count,
                        elements: Array.isArray(item.elements) ? item.elements : [],
                        avg_duration: typeof item.avg_duration === 'string' ? parseFloat(item.avg_duration) : item.avg_duration,
                        element_details: item.element_details || null
                    }))
                    : [];

                console.log('Обработанные данные heatmap:', processedHeatmapData);

                // Преобразуем строковые значения в числовые для stats
                const processedStatsData: ElementStat[] = Array.isArray(statsData)
                    ? statsData.map(item => ({
                        type: item.type,
                        count: typeof item.count === 'string' ? parseInt(item.count, 10) : item.count,
                        avg_duration: typeof item.avg_duration === 'string' ? parseFloat(item.avg_duration) : item.avg_duration,
                        engagement: typeof item.engagement === 'string' ? parseFloat(item.engagement) : item.engagement,
                        devices: item.devices || [],
                        locations: item.locations || []
                    }))
                    : [];

                console.log('Обработанные данные stats:', processedStatsData);

                // Устанавливаем данные в состояние
                setElementStats(processedStatsData);
                setHeatmapData(processedHeatmapData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setElementStats([]);
                setHeatmapData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSite, selectedPage, timeRange]);

    const handleElementClick = (elementType: string) => {
        setSelectedElement(elementType);
    };

    const handleCellClick = (cell: HeatmapCell) => {
        setSelectedCell(cell);
    };

    return (
        <div className="dashboard-container">
            <Card
                title={<Title level={4}>Аналитика взаимодействий: {selectedPage?.label || 'Весь сайт'}</Title>}
                extra={
                    <Select<TimeRange>
                        value={timeRange}
                        onChange={setTimeRange}
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
                    {/* Добавим проверку наличия данных с выводом информации */}
                    {heatmapData.length === 0 ? (
                        <Alert
                            message="Нет данных для тепловой карты"
                            description="Проверьте выбранный сайт, страницу и временной диапазон"
                            type="info"
                        />
                    ) : (
                        <HeatmapTableVisualization
                            data={heatmapData}
                            onCellClick={handleCellClick}
                            pageUrl={selectedPage?.value}
                        />
                    )}

                    {elementStats.length === 0 ? (
                        <Alert
                            message="Нет данных о статистике элементов"
                            description="Проверьте выбранный сайт, страницу и временной диапазон"
                            type="info"
                            style={{ marginTop: 16 }}
                        />
                    ) : (
                        <ElementStatsTable
                            data={elementStats}
                            onRowClick={handleElementClick}
                        />
                    )}
                </Spin>
            </Card>

            {selectedElement && (
                <ElementDetailsModal
                    elementType={selectedElement}
                    webId={selectedSite?.value || 0}
                    pageUrl={selectedPage?.value || ''}
                    range={timeRange}
                    onClose={() => setSelectedElement(null)}
                />
            )}

            {selectedCell && (
                <ClickDetailsModal
                    cell={selectedCell}
                    onClose={() => setSelectedCell(null)}
                />
            )}
        </div>
    );
};

export default InteractionDashboard;
// import { User } from "../../../../models/user.model";
// import { PageOption } from "../../hooks/useHeatmaps";

// interface HeatmapVisualizationProps {
//     selectedPage: PageOption | null;
//     containerRef: React.RefObject<HTMLDivElement>;
//     iframeRef: React.RefObject<HTMLIFrameElement>;
//     user: User | null;
//     loading: boolean;
// }

// const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({
//     selectedPage,
//     containerRef,
//     iframeRef
// }) => {
//     // const handleIframeLoad = () => {
//     //     if (iframeRef.current && containerRef.current) {
//     //         containerRef.current.style.width = `${iframeRef.current.offsetWidth}px`;
//     //         containerRef.current.style.height = `${iframeRef.current.offsetHeight}px`;
//     //     }
//     // };


//     const handleIframeLoad = () => {
//         console.log('Iframe loaded');
//         if (iframeRef.current) {
//             const rect = iframeRef.current.getBoundingClientRect();
//             console.log('Iframe dimensions after load:', rect);
//         }
//     };

//     return (
//         <div className="heatmap-content">
//             <div className="heatmap-visualization">
//                 <div className="heatmap-container">
//                     {selectedPage ? (
//                         <>
//                             <iframe
//                                 ref={iframeRef}
//                                 src={selectedPage.value}
//                                 className="heatmap-iframe"
//                                 title="Page preview"
//                                 onLoad={handleIframeLoad}
//                             />
//                             <div
//                                 ref={containerRef}
//                                 className="heatmap-overlay"
//                                 style={{
//                                     position: 'absolute',
//                                     top: 0,
//                                     left: 0,
//                                     pointerEvents: 'none'
//                                 }}
//                             />
//                         </>
//                     ) : (
//                         <div className="no-page-selected">
//                             Выберите страницу для отображения тепловой карты
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HeatmapVisualization;

import { useState, useEffect } from 'react';
import axios from 'axios';
import './HeatmapVisualisation.css';
import { PageOption } from '../../hooks/useHeatmaps';
import { User } from '../../../../models/user.model';

interface HeatmapPoint {
    eventData: {
        x: number;
        y: number;
    };
    clickCount: number;
}

interface SiteOption {
    value: number;
    label: string;
}

interface HeatmapResponse {
    data: HeatmapPoint[];
}

interface HeatmapProps {
    selectedPage: PageOption | null;
    containerRef: React.RefObject<HTMLDivElement>;
    iframeRef: React.RefObject<HTMLIFrameElement>;
    site: SiteOption | null;
    user: User | null;
    loading: boolean;
}

const HeatmapVisualization: React.FC<HeatmapProps> = ({
    selectedPage,
    containerRef,
    iframeRef,
    site,
    user,
    loading }) => {
    const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (site && selectedPage) {
            fetchHeatmapData();
        }
    }, [site, selectedPage]);

    // const normalizeUrl = (url) => {
    //     try {
    //         const urlObj = new URL(url);
    //         return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}${urlObj.search}`;
    //     } catch (e) {
    //         return url;
    //     }
    // };

    const fetchHeatmapData = async () => {
        try {
            // loading(true);
            // const normalizedUrl = normalizeUrl(window.location.href);

            const response = await axios.get<{ data: HeatmapPoint[] }>(`${process.env.REACT_APP_API_URL}/events/click-heatmap?web_id=${site?.value}&page_url=${selectedPage?.value}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
            );

            setHeatmapData(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch heatmap data');
            console.error('Error fetching heatmap data:', err);
        } finally {
            // setLoading(false);
        }
    };

    const getHeatmapIntensity = (clickCount: number): string => {
        const maxClicks = Math.max(...heatmapData.map(data => data.clickCount));
        const intensity = (clickCount / maxClicks) * 100;
        return `rgba(239, 68, 68, ${Math.max(0.2, intensity / 100)})`;
    };

    if (!site || !selectedPage) {
        return <div className="heatmap__error">Please select a site and page</div>;
    }

    return (
        <div className="heatmap">
            {/* Visualization Layer */}
            <div className="heatmap__visualization">
                {heatmapData.map((point, index) => (
                    <div
                        key={index}
                        className="heatmap__heat-point"
                        style={{
                            left: `${point.eventData.x}px`,
                            top: `${point.eventData.y}px`,
                            backgroundColor: getHeatmapIntensity(point.clickCount),
                        }}
                    />
                ))}
            </div>

            {/* Click Points Layer */}
            <div className="heatmap__points">
                {heatmapData.map((point, index) => (
                    <div
                        key={`point-${index}`}
                        className="heatmap__click-point"
                        style={{
                            left: `${point.eventData.x}px`,
                            top: `${point.eventData.y}px`,
                        }}
                    />
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="heatmap__loading">
                    <div className="heatmap__loading-content">
                        <div className="heatmap__spinner" />
                        <p className="heatmap__loading-text">Loading heatmap data...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="heatmap__error">
                    <p className="heatmap__error-text">{error}</p>
                </div>
            )}

            {/* Legend */}
            <div className="heatmap__legend">
                <h3 className="heatmap__legend-title">Click Intensity</h3>
                <div className="heatmap__legend-scale">
                    <div className="heatmap__legend-gradient" />
                    <span className="heatmap__legend-label">High</span>
                </div>
            </div>
        </div>
    );
};

export default HeatmapVisualization;
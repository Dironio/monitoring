// HeatmapPoints.tsx
import React, { useEffect, useState } from 'react';

interface HeatmapPointsProps {
    points: Array<{
        eventData: {
            x: number;
            y: number;
        };
        clickCount: number;
    }>;
    containerWidth: number;
    containerHeight: number;
    debugMode?: boolean;
}

const HeatmapPoints: React.FC<HeatmapPointsProps> = ({
    points,
    containerWidth,
    containerHeight,
    debugMode
}) => {
    const [maxClicks, setMaxClicks] = useState(0);
    const [normalizedPoints, setNormalizedPoints] = useState(points);

    useEffect(() => {
        if (points.length > 0) {
            const maxX = Math.max(...points.map(p => p.eventData.x));
            const maxY = Math.max(...points.map(p => p.eventData.y));
            const maxClickCount = Math.max(...points.map(p => p.clickCount));

            setMaxClicks(maxClickCount);

            const normalized = points.map(point => ({
                ...point,
                eventData: {
                    x: (point.eventData.x / maxX) * containerWidth,
                    y: (point.eventData.y / maxY) * containerHeight
                }
            }));

            setNormalizedPoints(normalized);
        }
    }, [points, containerWidth, containerHeight]);

    const getPointColor = (clicks: number) => {
        const ratio = clicks / maxClicks;
        const hue = 240 - (ratio * 240);
        const saturation = 80 + (ratio * 20);
        const lightness = 50;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const getPointSize = (clicks: number) => {
        const minSize = 12;
        const maxSize = 24;
        const ratio = clicks / maxClicks;
        return minSize + (maxSize - minSize) * ratio;
    };

    return (
        <div className={`dots-overlay ${debugMode ? 'debug-mode' : ''}`}>
            {normalizedPoints.map((point, index) => (
                <div
                    key={index}
                    className="click-dot"
                    style={{
                        left: `${point.eventData.x}px`,
                        top: `${point.eventData.y}px`,
                        width: `${getPointSize(point.clickCount)}px`,
                        height: `${getPointSize(point.clickCount)}px`,
                        backgroundColor: getPointColor(point.clickCount)
                    }}
                    title={`Клики: ${point.clickCount}`}
                />
            ))}
            <div className="heatmap-legend">
                <div className="legend-gradient" />
                <div className="legend-labels">
                    <span>Мало кликов</span>
                    <span>Много кликов</span>
                </div>
            </div>
        </div>
    );
};

export default HeatmapPoints;

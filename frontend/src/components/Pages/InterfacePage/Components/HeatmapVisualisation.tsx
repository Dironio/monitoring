import { User } from "../../../../models/user.model";
import { PageOption } from "../../hooks/useHeatmaps";

interface HeatmapVisualizationProps {
    selectedPage: PageOption | null;
    containerRef: React.RefObject<HTMLDivElement>;
    iframeRef: React.RefObject<HTMLIFrameElement>;
    user: User | null;
    loading: boolean;
}

const HeatmapVisualization: React.FC<HeatmapVisualizationProps> = ({
    selectedPage,
    containerRef,
    iframeRef
}) => {
    // const handleIframeLoad = () => {
    //     if (iframeRef.current && containerRef.current) {
    //         containerRef.current.style.width = `${iframeRef.current.offsetWidth}px`;
    //         containerRef.current.style.height = `${iframeRef.current.offsetHeight}px`;
    //     }
    // };


    const handleIframeLoad = () => {
        console.log('Iframe loaded');
        if (iframeRef.current) {
            const rect = iframeRef.current.getBoundingClientRect();
            console.log('Iframe dimensions after load:', rect);
        }
    };

    return (
        <div className="heatmap-content">
            <div className="heatmap-visualization">
                <div className="heatmap-container">
                    {selectedPage ? (
                        <>
                            <iframe
                                ref={iframeRef}
                                src={selectedPage.value}
                                className="heatmap-iframe"
                                title="Page preview"
                                onLoad={handleIframeLoad}
                            />
                            <div
                                ref={containerRef}
                                className="heatmap-overlay"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    pointerEvents: 'none'
                                }}
                            />
                        </>
                    ) : (
                        <div className="no-page-selected">
                            Выберите страницу для отображения тепловой карты
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeatmapVisualization;
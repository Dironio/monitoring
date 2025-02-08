import ErrorAnalysis from "./Components/ErrorAnalysis";
import PerformanceMetrics from "./Components/PerformanceMetrics";
import ResourceAnalysis from "./Components/ResourceAnalysis";
import SeoAnalysis from "./Components/SeoAnalysis";
import UptimeStatus from "./Components/UptimeStatus";

const TechnicalMonitoringPage: React.FC = () => {
    return (
        <div className="technical-monitoring-page">
            <h1>Технический мониторинг</h1>
            <div className="metrics-grid">
                <PerformanceMetrics />
                <ErrorAnalysis />
                <UptimeStatus />
                <ResourceAnalysis />
                <SeoAnalysis />
            </div>
        </div>
    );
};

export default TechnicalMonitoringPage;
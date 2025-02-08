import ClickAnalysis from "./Components/ClickAnalysis";
import EventAnalysis from "./Components/EventAnalysis";
import PageDepth from "./Components/PageDepth";
import TimeOnSite from "./Components/TimeOnSite";


const BehaviorAnalysisPage: React.FC = () => {
    return (
        <div className="behavior-analysis-page">
            <h1>Поведенческий анализ</h1>
            <div className="metrics-grid">
                <TimeOnSite />
                <PageDepth />
                <ClickAnalysis />
                <EventAnalysis />
            </div>
        </div>
    );
};

export default BehaviorAnalysisPage;
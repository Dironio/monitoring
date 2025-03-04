import ClickAnalysis from "./Components/ClickAnalysis";
import EventAnalysis from "./Components/EventAnalysis";
import FormAnalysis from "./Components/FormAnalysis";
import PageDepth from "./Components/PageDepth";
import ScrollPercentage from "./Components/ScrollPercentage";
import TimeOnSite from "./Components/TimeOnSite";


const BehaviorAnalysisPage: React.FC = () => {
    return (
        <div className="behavior-analysis-page">
            <div className="metrics-grid">
                <TimeOnSite />
                <PageDepth />
                <ClickAnalysis />
                <EventAnalysis />
                <ScrollPercentage />
                <FormAnalysis />
            </div>
        </div>
    );
};

export default BehaviorAnalysisPage;
import { Route } from "react-router-dom";
import { User } from "../models/user.model";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import MetricPage from "../components/Pages/BehaviorMetricPage/BehaviorMetricPage";
import EventAnalysisComponent from "../components/Pages/BehaviorMetricPage/Components/EventAnalysisComponents";

interface MetricsRouterProps {
    user: User | null;
    loading: boolean;
}

const MetricsRouter: React.FC<MetricsRouterProps> = ({ user, loading }) => {
    return (
        <Route
            path="/metrics"
            element={
                <ProtectedRoute user={user} loading={loading}>
                    <MetricPage user={user} loading={loading} />
                </ProtectedRoute>
            }
        >
            <Route path="event-analysis" element={<EventAnalysisComponent user={user} loading={loading} />} />

        </Route>
    )
}

export default MetricsRouter;
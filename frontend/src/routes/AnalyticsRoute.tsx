import { Route } from "react-router-dom";
import { User } from "../models/user.model";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import BehaviorAnalysisPage from "../components/Pages/BehaviorAnalysis/AnalysisPage";

interface AnalyticsRouterProps {
    user: User | null;
    loading: boolean;
}

const AnalyticsRouter: React.FC<AnalyticsRouterProps> = ({ user, loading }) => {
    return (
        <Route
            path="/analytics"
            element={
                <ProtectedRoute user={user} loading={loading}>
                    <BehaviorAnalysisPage user={user} loading={loading} />
                </ProtectedRoute>
            }
        >
            {/* <Route path="behavior-analysis" element={<BehaviorAnalysisComponent user={user} loading={loading} />} /> */}
            {/* <Route path="overview" element={<OverviewComponent user={user} loading={loading} />} />
                                <Route path="average-time" element={<AverageTimeComponent user={user} loading={loading} />} /> */}
        </Route>
    )
}

export default AnalyticsRouter;
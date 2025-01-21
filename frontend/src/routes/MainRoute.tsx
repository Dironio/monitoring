import { Route } from "react-router-dom";
import { User } from "../models/user.model";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import MainPage from "../components/Pages/MainPage/MainPage";
import OverviewComponent from "../components/Pages/MainPage/OverviewPage/OverviewComponent";
import AverageTimeComponent from "../components/Pages/MainPage/AveragePage/AverageTimeComponent";
import HistoryComponent from "../components/Pages/MainPage/SessionHistoryPage/SessionHistoryComponent";

interface MainRouterProps {
    user: User | null;
    loading: boolean;
}

const MainRouter: React.FC<MainRouterProps> = ({ user, loading }) => {
    return (
        <Route
            path="/main"
            element={
                <ProtectedRoute user={user} loading={loading}>
                    <MainPage user={user} loading={loading} />
                </ProtectedRoute>
            }
        >
            <Route path="overview" element={<OverviewComponent user={user} loading={loading} />} />
            <Route path="average-time" element={<AverageTimeComponent user={user} loading={loading} />} />
            <Route path="visit-history" element={<HistoryComponent user={user} loading={loading} />} />
        </Route>

    )
}

export default MainRouter;
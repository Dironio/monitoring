import { Route } from "react-router-dom";
import { User } from "../models/user.model";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import InterfacePage from "../components/Pages/InterfacePage/InterfacePage";
import HeatmapPage from "../components/Pages/InterfacePage/Components/HeatmapPage";

interface InterfaceRouterProps {
    user: User | null;
    loading: boolean;
}

const InterfaceRouter: React.FC<InterfaceRouterProps> = ({ user, loading }) => {
    return (
        <Route
            path="/interface"
            element={
                <ProtectedRoute user={user} loading={loading}>
                    <InterfacePage user={user} loading={loading} />
                </ProtectedRoute>
            }
        >
            <Route path="heatmap-page" element={<HeatmapPage
            // user={user} loading={loading} 
            />} />
            {/* <Route path="heatmap-scroll" element={<EventAnalysisComponent user={user} loading={loading} />} /> */}
        </Route>
    )
}

export default InterfaceRouter;
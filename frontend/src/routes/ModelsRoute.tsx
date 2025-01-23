import { Route } from "react-router-dom";
import { User } from "../models/user.model";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import ModelsPage from "../components/Pages/ModelsPage/ModelsPage";
import ClusteringComponent from "../components/Pages/ModelsPage/ClusteringPage/ClusteringPage";

interface ModelsRouterProps {
    user: User | null;
    loading: boolean;
}

const ModelsRouter: React.FC<ModelsRouterProps> = ({ user, loading }) => {
    return (
        <Route
            path="/models"
            element={
                <ProtectedRoute user={user} loading={loading}>
                    <ModelsPage user={user} loading={loading} />
                </ProtectedRoute>
            }
        >
            <Route path="clustering" element={<ClusteringComponent
            // user={user} loading={loading} 
            />} />
        </Route>
    )
}

export default ModelsRouter;
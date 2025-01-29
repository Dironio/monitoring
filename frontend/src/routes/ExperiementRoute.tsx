import { Route } from "react-router-dom";
import ExperiementPage from "../components/Pages/ExperimentPage/ExpereimentPage";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { User } from "../models/user.model";
import SurveysPage from "../components/Pages/ExperimentPage/Components/SurveysPage/SurveysPage";


interface ExperiementRouterProps {
    user: User | null;
    loading: boolean;
}

const ExperiementRouter: React.FC<ExperiementRouterProps> = ({ user, loading }) => {
    return (
        <Route
            path="/experiments"
            element={
                <ProtectedRoute user={user} loading={loading}>
                    <ExperiementPage user={user} loading={loading} />
                </ProtectedRoute>
            }
        >
            <Route path="surveys" element={<SurveysPage />} />
        </Route>

    )
}

export default ExperiementRouter;
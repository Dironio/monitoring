import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AccountPage from "../components/Pages/AccountPage/AccountPage";
import AccountSettings from "../components/Pages/AccountPage/AccountSettings/AccountSetting";
import { User } from "../models/user.model";

interface AccountRoutesProps {
    user: User | null;
    loading: boolean;
}

const AccountRoutes: React.FC<AccountRoutesProps> = ({ user, loading }) => {
    return (
        <Route path="/account">
            <Route
                index
                element={
                    <ProtectedRoute user={user} loading={loading}>
                        <AccountPage user={user} loading={loading} />
                    </ProtectedRoute>
                }
            />

            <Route
                path="settings"
                element={
                    <ProtectedRoute user={user} loading={loading}>
                        <AccountSettings user={user} loading={loading} />
                    </ProtectedRoute>
                }
            />

            {/* <Route
                path="main"
                element={
                    <ProtectedRoute user={user} loading={loading}>
                        <AccountMain user={user} loading={loading} />
                    </ProtectedRoute>
                }
            />

            <Route
                path="sales-analytics"
                element={
                    <ProtectedRoute user={user} loading={loading}>
                        <SalesAnalytics user={user} loading={loading} />
                    </ProtectedRoute>
                }
            />

            <Route
                path="sales"
                element={
                    <ProtectedRoute user={user} loading={loading}>
                        <Sales user={user} loading={loading} />
                    </ProtectedRoute>
                }
            /> */}
        </Route>
    );
};

export default AccountRoutes;
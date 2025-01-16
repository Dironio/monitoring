import { User } from "../../../../models/user.model";

interface ClusteringComponentProps {
    user: User | null;
    loading: boolean;
}

const ClusteringComponent: React.FC<ClusteringComponentProps> = ({ user, loading }) => {
    return (
        <div className="">{user?.email}</div>
    )
}

export default ClusteringComponent;
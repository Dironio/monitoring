import './ExperiementPage.css';
import { User } from "../../../models/user.model";


interface ExperiementPageProps {
    user: User | null;
    loading: boolean;
}

const ExperiementPage: React.FC<ExperiementPageProps> = ({ user, loading }) => {
    return (
        <div className=""></div>
    )
}

export default ExperiementPage;
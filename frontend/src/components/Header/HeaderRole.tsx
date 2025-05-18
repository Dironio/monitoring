import { Link } from "react-router-dom";
import { User } from "../../models/user.model";

interface HeaderRoleProps {
    user: User | null;
    // loading: boolean;
}

export const HeaderRole: React.FC<HeaderRoleProps> = ({ user }) => {
    // console.log("Role:", user?.role_id);

    const role = Number(user?.role_id);

    switch (role) {
        case 1:
            return (
                <Link to="/application">
                    <button className="header__btn">Оставить заявку</button>
                </Link>
            );
        case 2:
            return (
                <div className="header__double-btn">
                    <Link to="/application">
                        <button className="header__btn">Стать админом</button>
                    </Link>
                </div>
            );
        case 3:
            return (
                <Link to="/dashboard">
                    <button className="header__btn">Составить отчет</button>
                </Link>
            );
        case 4:
            return (
                <Link to="/dashboard">
                    <button className="header__btn">Составить отчет</button>
                </Link>
            );
        default:
            return <Link to="/application">
                <button className="header__btn">Оставить заявку</button>
            </Link>
    }
};

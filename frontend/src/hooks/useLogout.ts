import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useLogout = (onComplete: () => void) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            console.log("Ответ:", response.data);
            localStorage.removeItem("accessToken");

            onComplete();
            navigate("/");
            navigate(0);
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    return { handleLogout };
};
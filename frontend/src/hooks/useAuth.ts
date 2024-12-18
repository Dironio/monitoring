import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginResponse {
    user: {
        username: string;
        password: string;
    };
    accessToken: string;
}

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [authErrors, setAuthErrors] = useState<{ [key: string]: string | null }>({});
    const navigate = useNavigate();

    const handleAuth = async (
        isSignUp: boolean,
        formData: Record<string, any>
    ) => {
        const url = isSignUp
            ? `${process.env.REACT_APP_API_URL}/auth/signup`
            : `${process.env.REACT_APP_API_URL}/auth/login`;

        console.log("URL для отправки:", url);

        const data = isSignUp
            ? {
                firstName: formData.firstName || null,
                lastName: formData.lastName || null,
                email: formData.email,
                username: formData.username,
                password: formData.password,
            }
            : {
                username: formData.username,
                password: formData.password,
            };

        console.log("Данные для отправки:", data);

        setLoading(true);

        try {
            const response = await axios.post<LoginResponse>(url, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            console.log("Ответ от сервера:", response.data);
            const { accessToken } = response.data;

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                console.log("Токен сохранен в localStorage");
            }

            navigate("/");
            setAuthErrors({});
        } catch (err: any) {
            console.error(err.response?.data?.message || "Ошибка сети");
            setAuthErrors((prev) => ({
                ...prev,
                general: err.response?.data?.message || "Ошибка сети. Попробуйте позже.",
            }));
        } finally {
            setLoading(false);
        }
    };

    return { handleAuth, loading, authErrors };
};
import axios from "axios";

export interface ValidationResponse {
    isAvailable: boolean;
    message: string;
}

export interface CheckAvailabilityResponse {
    results: {
        username?: boolean;
        email?: boolean;
    };
    messages: {
        username?: string;
        email?: string;
    };
}

export const checkAvailability = async (
    username?: string,
    email?: string
): Promise<CheckAvailabilityResponse> => {
    try {
        const response = await axios.post<CheckAvailabilityResponse>(
            `${process.env.REACT_APP_API_URL}/auth/check`,
            { username, email },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error("Ошибка при проверке доступности");
    }
};

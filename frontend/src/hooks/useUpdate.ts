import axios from 'axios';
import { User } from '../models/user.model';

export interface IUpdateUserData {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    username?: string;
    current_password?: string;
    new_password?: string;
}

interface ErrorResponse {
    data?: {
        message?: string;
    };
}

export const userService = {
    async updateUser(data: IUpdateUserData): Promise<User> {
        try {
            if (!data.id || isNaN(Number(data.id))) {
                throw new Error('ID пользователя не указан или неверного формата');
            }

            const response = await axios.patch<User>(
                `${process.env.REACT_APP_API_URL}/users`,
                {
                    ...data,
                    id: Number(data.id)
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const errorResponse = error.response as ErrorResponse;
                throw new Error(
                    errorResponse.data?.message || 'Ошибка при обновлении данных'
                );
            }
            throw new Error('Неизвестная ошибка при обновлении данных');
        }
    }
};
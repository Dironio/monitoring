import axios from 'axios';
import { User } from '../models/user.model';

export interface IUpdateUserData {
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
            const response = await axios.patch<User>(
                `${process.env.REACT_APP_API_URL}/users`,
                data,
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
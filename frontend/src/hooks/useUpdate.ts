import axios from 'axios';

export const userService = {
    async updateUser(data: IUpdateUserData) {
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/users`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Ошибка при обновлении данных');
            }
            throw error;
        }
    }
};

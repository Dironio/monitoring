import userDal from '../data/user.dal';
import { CreateUserDto, UpdateUserDto, User } from './@types/user.dto'


class UserService {
    async create(dto: CreateUserDto): Promise<User> {
        return await userDal.create(dto);
    }

    async getAll() {
        return await userDal.getAll();
    }

    async getOne(userId: number) {
        return await userDal.getOne(userId)
    }

    async getUserByIndentity({ username, email }: { username: string; email: string }): Promise<User> {
        return await userDal.getUserByIndentity({ username, email });
    }

    async getUserByUsername(username: string): Promise<User> {
        return await userDal.getUserByUsername(username);
    }

    async update(dto: UpdateUserDto): Promise<User> {
        return await userDal.update(dto);
    }

    async delete(userId: number) {
        return await userDal.delete(userId)
    }

    async getRoleById(role_id: number): Promise<User>{
        return await userDal.getRoleById(role_id);
    }
}

const userService = new UserService();
export default userService;
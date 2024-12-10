


class UserService {
    calculateAge(birthday: Date | string): number {
        const birthDate = typeof birthday === 'string' ? new Date(birthday.replace('/', '-')) : birthday;

        if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
            throw new Error('Invalid birth date');
        }

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();


        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }


    async create(dto: CreateUserDto): Promise<User> {
        if (dto.birthday) {
            dto.age = this.calculateAge(dto.birthday);
        }


        const result = await userDal.create(dto);
        await cartService.create({ user_id: result.id });
        return result;
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
        if (dto.birthday) {
            dto.age = this.calculateAge(dto.birthday);
        }

        return await userDal.update(dto);
    }

    async delete(userId: number) {
        return await userDal.delete(userId)
    }
}

const userService = new UserService();
export default userService;
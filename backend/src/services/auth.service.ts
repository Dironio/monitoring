import userService from "./user.service";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "dotenv";
import ApiError from "../middlewares/ApiError";
import { JwtTokens, TokenDecoded, TokenPayload } from "./types/tokenPayload";
import { CreatedUser, CreateUserDto, LoginUserDto, UserRole } from "./types/user.dto";

config({ path: './.env' });

class AuthService {
    generateTokens(payload: TokenPayload): JwtTokens {
        // const tokenPayload = {
        //     id: payload.id,
        //     username: payload.username,
        //     role_id: payload.role_id,
        // };

        const refreshToken = jwt.sign(payload, process.env.JWT_REF_SEC as string, { expiresIn: '30d' });
        const accessToken = jwt.sign(payload, process.env.JWT_ACC_SEC as string, { expiresIn: '30d' });
        return { refreshToken, accessToken };
    }

    validateRefreshToken(refreshToken: string): TokenDecoded | null {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REF_SEC as string) as TokenDecoded;
        } catch (err) {
            return null;
        }
    }

    validateAccessToken(accessToken: string): TokenPayload | null {
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_ACC_SEC as string) as TokenPayload;
            // console.log('Decoded token:', decoded);
            return decoded;
        } catch (err) {
            console.error('Token validation failed:', err.message);
            return null;
        }
    }


    async signup(dto: CreateUserDto): Promise<CreatedUser> {
        const existingUser = await userService.getUserByIndentity({ username: dto.username, email: dto.email });
        if (existingUser) throw ApiError.BadRequest('Email or username already used');

        const newUser = await userService.create(dto);

        const tokenPayload: TokenPayload = {
            id: newUser.id,
            email: newUser.email,
            username: newUser.username,
            // role: newUser.role as UserRole,
            role_id: 
            // newUser.role_id ||
             1,
        };

        const jwtTokens = this.generateTokens(tokenPayload);
        return { user: newUser, tokens: jwtTokens };
    }


    async login(dto: LoginUserDto): Promise<CreatedUser> {
        const user = await userService.getUserByUsername(dto.username);

        if (!user) throw ApiError.NotFound('User not found');

        if (!user.password) throw ApiError.BadRequest('Password is missing');

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) throw ApiError.UnauthorizedError('Invalid password');

        const role = await userService.getRoleById(user.role_id);

        const tokenPayload: TokenPayload = {
            id: user.id,
            username: user.username,
            // role: role.role as UserRole,
            role_id: user.role_id,
            // role: user.role as UserRole,
            // role_id: user.role_id || 1,
        };

        const jwtTokens = this.generateTokens(tokenPayload);
        return { user, tokens: jwtTokens };
    }


    async refresh(refreshToken: string): Promise<JwtTokens> {
        if (!refreshToken) throw ApiError.UnauthorizedError();

        const userData = this.validateRefreshToken(refreshToken);
        if (!userData) throw ApiError.UnauthorizedError();

        const user = await userService.getOne(userData.id);
        if (!user) throw ApiError.UnauthorizedError("User not found");

        const role = await userService.getRoleById(user.role_id);

        const tokenPayload: TokenPayload = {
            id: user.id,
            username: user.username,
            // role: role.role as UserRole,
            role_id: user.role_id,
        };

        const jwtTokens = this.generateTokens(tokenPayload);

        return jwtTokens;
    }
}

const authService = new AuthService();
export default authService;
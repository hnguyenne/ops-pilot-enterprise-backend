import { getUserInfo } from './service';
import { api } from 'encore.dev/api';
import { User } from './model';
import { ApiResponse } from '../utils/response';


export const getUserInfoAPI = api(
    {
        method: 'GET',
        path: '/users/info',
    },
    async ({ token }: { token: string }): Promise<ApiResponse<User>> => {
        try {
            if (!token) {
                return {
                    success: false,
                    message: 'No token provided'
                };
            }
            const user = await getUserInfo(token);
            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                };
            }
            return {
                success: true,
                message: 'User information retrieved successfully',
                data: user
            };
        } catch (error) {
            console.error('Error getting user info:', error);
            return {
                success: false,
                message: 'Failed to get user information'
            };
        }
    }
);


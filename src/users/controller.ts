import { getUserInfo } from './service';
import { api } from 'encore.dev/api';

export const getUserInfoAPI = api(
    {
        method: 'GET',
        path: '/users/info',
    },
    async ({ token }: { token: string }) => {
        if (!token) {
            throw new Error('No token provided');
        }
        const user = await getUserInfo(token);
        return user;
    }
);


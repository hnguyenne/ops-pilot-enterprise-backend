import { PrismaClient } from '@prisma/client';
import { User } from './model';
import { getUserFromToken } from '../auth/auth';

const prisma = new PrismaClient();

export async function getUserInfo(token: string): Promise<User | null> {
    console.log('Received token:', token);
    const user = await getUserFromToken(token);
    console.log('Decoded user:', user);
    if (!user) return null;
    return user;
}

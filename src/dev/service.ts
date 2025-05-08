import { PrismaClient, Role } from '@prisma/client';
import { User } from './model';

export const listUsers = async (): Promise<User[]> => {
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany();
    return users;
}

export const assignRole = async (userId: string, role: Role) => {
    const prisma = new PrismaClient();
    const user = await prisma.user.update({
        where: { id: userId },
        data: { role }
    });
    return user;
}

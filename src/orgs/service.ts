import { PrismaClient } from '@prisma/client';
import { Organization } from './model';

const prisma = new PrismaClient();

export async function createOrganization(name: string, description: string): Promise<Organization> {
    try {

        const newOrganization = await prisma.organization.create({
            data: {
                name,
                description,
            },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
            },
        });
        return newOrganization;
    } catch (error) {
        console.error("Error creating organization:", error);
        throw error;
    }
}

export async function getOrganizationById(id: number): Promise<Organization | null> {
    try {
        const organization = await prisma.organization.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
            },
        });
        return organization;
    } catch (error) {
        console.error("Error fetching organization:", error);
        throw error;
    }
}
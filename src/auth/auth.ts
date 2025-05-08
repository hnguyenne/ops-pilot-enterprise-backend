import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { jwt } from "better-auth/plugins"

const prisma = new PrismaClient();

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-for-development',
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        modelName: "User",
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "EMPLOYEE",
                input: false,
            },
            organizationId: {
                type: "number",
                required: true,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    session: {
        disableSessionRefresh: true
    },
    plugins: [
        jwt(),
    ]
});

/**
 * Verifies a token and returns the decoded payload
 * @param token The token to verify
 * @returns The decoded token payload or null if invalid
 */
export const verifyToken = async (token: string) => {
    try {
        console.log('Verifying token...');
        const session = await prisma.session.findFirst({
            where: { token },
            select: {
                userId: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        organizationId: true,
                    }
                }
            }
        });
        
        if (!session) {
            console.log('Session not found');
            return null;
        }

        console.log('Found session:', session);
        return {
            userId: session.userId,
            user: session.user
        };
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};

/**
 * Gets user information from a token
 * @param token The token containing user information
 * @returns The user information or null if token is invalid
 */
export const getUserFromToken = async (token: string) => {
    try {
        const decoded = await verifyToken(token);
        if (!decoded) {
            console.log('Token verification failed');
            return null;
        }

        return decoded.user;
    } catch (error) {
        console.error('Error getting user from token:', error);
        return null;
    }
};






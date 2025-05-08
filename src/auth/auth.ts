import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

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
});




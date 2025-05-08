import { api } from "encore.dev/api";
import { auth } from "./auth";


export const register = api(
    {
        method: "POST",
        path: "/auth/register",
    },
    async ({ email, password, name, organizationId }: { 
        email: string; 
        password: string;
        name: string;
        organizationId: number;
    }) => {
        try {
            const res = await auth.api.signUpEmail({ 
                body: {
                    name,
                    email,
                    password,
                    organizationId
                },
                asResponse: true
            });

            // Extract the token from the response headers
            const cookies = res.headers.get('set-cookie');
            const token = cookies?.split(';')[0].split('=')[1];

            // Convert response to JSON
            const userData = await res.json();
            return { 
                success: true,
                message: "User registered successfully",
                data: {
                    token,
                    user: userData
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('Failed to register user');
        }
    }
);

export const login = api(
    {
        method: "POST",
        path: "/auth/login",
    },
    async ({ email, password,  }: { email: string; password: string }) => {
        try {
            const result = await auth.api.signInEmail({ 
                body: { 
                    email, 
                    password 
                }
            });
            return { 
                success: true, 
                token: result.token,
                user: result.user 
            };
        } catch (error) {
            console.error('Login error:', error);
            throw new Error('Invalid credentials');
        }
    }
);
import { listUsers, assignRole } from "./service";
import { api } from "encore.dev/api";
import { User } from "./model";
import { ApiResponse } from "../utils/response";

type Role = 'PROJECTMANAGER' | 'EMPLOYEE' | 'ORGADMIN';

export const listUsersAPI = api({
    method: "GET",
    path: "/users",
}, async (): Promise<ApiResponse<User[]>> => {
    try {
        const users = await listUsers();
        return {
            success: true,
            message: "Users retrieved successfully",
            data: users
        };
    } catch (error) {
        console.error("Error listing users:", error);
        return {
            success: false,
            message: "Failed to retrieve users"
        };
    }
});

export const assignRoleAPI = api({
    method: "POST",
    path: "/users/assign-role",
}, async ({ userId, role }: { userId: string, role: Role }): Promise<ApiResponse<User>> => {
    try {
        const user = await assignRole(userId, role);
        return {
            success: true,
            message: "Role assigned successfully",
            data: user
        };
    } catch (error) {
        console.error("Error assigning role:", error);
        return {
            success: false,
            message: "Failed to assign role"
        };
    }
});


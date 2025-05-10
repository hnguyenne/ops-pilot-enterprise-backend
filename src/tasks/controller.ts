import { api } from "encore.dev/api";
import { PrismaClient } from '@prisma/client';
import { createTask, assignTask, updateTaskStatus } from "./service";
import { Task, CreateTaskDTO, UpdateTaskStatusDTO, AssignTaskDTO } from "./model";
import { ApiResponse } from "../utils/response";
import { getUserFromToken } from "../auth/auth";
import { validateProjectManager } from "../users/service";

export const createTaskAPI = api(
    {
        method: "POST",
        path: "/tasks",
    },
    async ({ 
        task, 
        token 
    }: { 
        task: CreateTaskDTO;
        token: string;
    }): Promise<ApiResponse<Task>> => {
        try {
            const user = await getUserFromToken(token);
            if (!user) {
                return {
                    success: false,
                    message: "Unauthorized"
                };
            }

            const isProjectManager = await validateProjectManager(user.id, user.organizationId);
            if (!isProjectManager) {
                return {
                    success: false,
                    message: "Only project managers can create tasks"
                };
            }

            const newTask = await createTask(task, user.organizationId);
            
            return {
                success: true,
                message: "Task created successfully",
                data: newTask
            };
        } catch (error) {
            console.error("Error creating task:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to create task"
            };
        }
    }
);

export const assignTaskAPI = api(
    {
        method: "POST",
        path: "/tasks/assign",
    },
    async ({ 
        assignment, 
        token 
    }: { 
        assignment: AssignTaskDTO;
        token: string;
    }): Promise<ApiResponse<Task>> => {
        try {
            const user = await getUserFromToken(token);
            if (!user) {
                return {
                    success: false,
                    message: "Unauthorized"
                };
            }

            const isProjectManager = await validateProjectManager(user.id, user.organizationId);
            if (!isProjectManager) {
                return {
                    success: false,
                    message: "Only project managers can assign tasks"
                };
            }

            const updatedTask = await assignTask(assignment, user.organizationId);
            
            return {
                success: true,
                message: "Task assigned successfully",
                data: updatedTask
            };
        } catch (error) {
            console.error("Error assigning task:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to assign task"
            };
        }
    }
);

export const updateTaskStatusAPI = api(
    {
        method: "PUT",
        path: "/tasks/:taskId/status",
    },
    async ({ 
        taskId, 
        status, 
        token 
    }: { 
        taskId: number;
        status: UpdateTaskStatusDTO;
        token: string;
    }): Promise<ApiResponse<Task>> => {
        try {
            const user = await getUserFromToken(token);
            if (!user) {
                return {
                    success: false,
                    message: "Unauthorized"
                };
            }

            const updatedTask = await updateTaskStatus(taskId, status, user.id, user.organizationId);
            
            return {
                success: true,
                message: "Task status updated successfully",
                data: updatedTask
            };
        } catch (error) {
            console.error("Error updating task status:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to update task status"
            };
        }
    }
);

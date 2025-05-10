import { api } from "encore.dev/api";
import { createProject, assignUserToProject, updateProject } from "./service";
import { CreateProjectDTO, Project, UpdateProjectDTO, Workflow } from "./model";
import { ApiResponse } from "../utils/response";
import { getUserFromToken } from "../auth/auth";
import { validateProjectManager } from "../users/service";
import { Request, Response } from "express";
import { addWorkflow as addWorkflowService } from "./service";

export const createProjectAPI = api(
    {
        method: "POST",
        path: "/projects",
    },
    async ({ project, token }: { 
        project: CreateProjectDTO; 
        token: string;
    }): Promise<ApiResponse<Project>> => {
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
                    message: "Only project managers can create projects"
                };
            }

            const newProject = await createProject(project, user.organizationId, [user.id]);
            
            return {
                success: true,
                message: "Project created successfully",
                data: newProject
            };
        } catch (error) {
            console.error("Error creating project:", error);
            return {
                success: false,
                message: "Failed to create project"
            };
        }
    }
);

export const assignUserToProjectAPI = api(
    {
        method: "POST",
        path: "/projects/assign-user",
    },
    async ({ projectId, userId, token }: { 
        projectId: number;
        userId: string;
        token: string;
    }): Promise<ApiResponse<Project>> => {
        try {
            // Verify token and get user
            const currentUser = await getUserFromToken(token);
            if (!currentUser) {
                return {
                    success: false,
                    message: "Unauthorized"
                };
            }

            // Verify if current user is a project manager
            const isProjectManager = await validateProjectManager(currentUser.id, currentUser.organizationId);
            if (!isProjectManager) {
                return {
                    success: false,
                    message: "Only project managers can assign users to projects"
                };
            }

            // Assign user to project
            const updatedProject = await assignUserToProject(
                projectId,
                userId,
                currentUser.organizationId
            );
            
            return {
                success: true,
                message: "User assigned to project successfully",
                data: updatedProject
            };
        } catch (error) {
            console.error("Error in assign user to project API:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to assign user to project"
            };
        }
    }
);

export const updateProjectAPI = api(
    {
        method: "PUT",
        path: "/projects/:id",
    },
    async ({ 
        id, 
        project, 
        token 
    }: { 
        id: number;
        project: UpdateProjectDTO; 
        token: string;
    }): Promise<ApiResponse<Project>> => {
        try {
            // Verify token and get user
            const currentUser = await getUserFromToken(token);
            if (!currentUser) {
                return {
                    success: false,
                    message: "Unauthorized"
                };
            }

            // Verify if current user is a project manager
            const isProjectManager = await validateProjectManager(
                currentUser.id, 
                currentUser.organizationId
            );
            if (!isProjectManager) {
                return {
                    success: false,
                    message: "Only project managers can update projects"
                };
            }

            const updatedProject = await updateProject(
                id,
                currentUser.organizationId,
                project
            );
            
            return {
                success: true,
                message: "Project updated successfully",
                data: updatedProject
            };
        } catch (error) {
            console.error("Error in update project API:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to update project"
            };
        }
    }
);

export const addWorkflowAPI = api(
    {
        method: "POST",
        path: "/projects/:projectId/workflows",
    },
    async ({ 
        projectId, 
        workflow, 
        token 
    }: { 
        projectId: number;
        workflow: { name: string; description: string };
        token: string;
    }): Promise<ApiResponse<Workflow>> => {
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
                    message: "Only project managers can add workflows"
                };
            }

            const newWorkflow = await addWorkflowService(
                projectId,
                user.organizationId,
                workflow
            );

            return {
                success: true,
                message: "Workflow added successfully",
                data: newWorkflow
            };
        } catch (error) {
            console.error("Error in add workflow API:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to add workflow"
            };
        }
    }
);
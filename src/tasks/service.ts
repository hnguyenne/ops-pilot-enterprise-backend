import { PrismaClient } from '@prisma/client';
import { Task, CreateTaskDTO, UpdateTaskStatusDTO, AssignTaskDTO } from './model';

const prisma = new PrismaClient();

export async function createTask(data: CreateTaskDTO, organizationId: number): Promise<Task> {
    try {
        // Check if project exists and belongs to organization
        const project = await prisma.project.findFirst({
            where: {
                id: data.projectId,
                organizationId: organizationId
            }
        });

        if (!project) {
            throw new Error("Project not found or does not belong to this organization");
        }

        // Check if workflow exists and belongs to project
        const workflow = await prisma.workflow.findFirst({
            where: {
                id: data.workflowId,
                projectId: data.projectId
            }
        });

        if (!workflow) {
            throw new Error("Workflow not found or does not belong to this project");
        }

        // If dependencies are provided, verify they exist and belong to the same project
        if (data.dependencies && data.dependencies.length > 0) {
            const dependencies = await prisma.task.findMany({
                where: {
                    id: { in: data.dependencies },
                    projectId: data.projectId
                }
            });

            if (dependencies.length !== data.dependencies.length) {
                throw new Error("One or more dependencies do not exist or do not belong to this project");
            }
        }

        // Create task
        const newTask = await prisma.task.create({
            data: {
                name: data.name,
                description: data.description,
                status: "NOT_STARTED",
                projectId: data.projectId,
                workflowId: data.workflowId,
                dependencies: data.dependencies && data.dependencies.length > 0 ? {
                    connect: data.dependencies.map(id => ({ id }))
                } : undefined
            },
            include: {
                dependencies: true,
                assignees: {
                    select: { id: true, email: true, name: true, role: true }
                }
            }
        });

        return newTask;
    } catch (error) {
        console.error("Error creating task:", error);
        throw error;
    }
}

export async function assignTask(data: AssignTaskDTO, organizationId: number): Promise<Task> {
    try {
        // Check if task exists and belongs to organization
        const task = await prisma.task.findFirst({
            where: {
                id: data.taskId,
                project: {
                    organizationId: organizationId
                }
            }
        });

        if (!task) {
            throw new Error("Task not found or does not belong to this organization");
        }

        // Check if all assignees exist and are employees
        const assignees = await prisma.user.findMany({
            where: {
                id: { in: data.assigneeIds },
                organizationId: organizationId,
                role: "EMPLOYEE"
            }
        });
        if (assignees.length !== data.assigneeIds.length) {
            throw new Error("One or more assignees not found or not employees of this organization");
        }

        // Assign users to task (replace all assignees)
        const updatedTask = await prisma.task.update({
            where: { id: data.taskId },
            data: {
                assignees: {
                    set: data.assigneeIds.map(id => ({ id }))
                }
            },
            include: {
                dependencies: true,
                assignees: {
                    select: { id: true, email: true, name: true, role: true }
                }
            }
        });

        return updatedTask;
    } catch (error) {
        console.error("Error assigning task:", error);
        throw error;
    }
}

export async function updateTaskStatus(
    taskId: number,
    data: UpdateTaskStatusDTO,
    userId: string,
    organizationId: number
): Promise<Task> {
    try {
        // Check if task exists and belongs to organization
        const task = await prisma.task.findFirst({
            where: {
                id: taskId,
                project: {
                    organizationId: organizationId
                }
            },
            include: {
                dependencies: true,
                assignees: true
            }
        });

        if (!task) {
            throw new Error("Task not found or does not belong to this organization");
        }

        // Only an assignee can update the task status
        const isAssignee = task.assignees.some(a => a.id === userId);
        if (!isAssignee) {
            throw new Error("Only an assignee can update the task status");
        }

        // If trying to mark as IN_PROGRESS, check dependencies
        if (data.status === "IN_PROGRESS") {
            const incompleteDependencies = task.dependencies.filter(
                dep => dep.status !== "COMPLETED"
            );
            if (incompleteDependencies.length > 0) {
                throw new Error("Cannot start task: some dependencies are not completed");
            }
        }

        // Update task status
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status: data.status },
            include: {
                dependencies: true,
                assignees: {
                    select: { id: true, email: true, name: true, role: true }
                }
            }
        });

        return updatedTask;
    } catch (error) {
        console.error("Error updating task status:", error);
        throw error;
    }
}

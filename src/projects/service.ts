import { PrismaClient } from '@prisma/client';
import { Project, CreateProjectDTO, UpdateProjectDTO } from './model';
import { Workflow } from './model';

const prisma = new PrismaClient();

export async function createProject(data: CreateProjectDTO, organizationId: number, userIds?: string[]): Promise<Project> {
    try {
        const newProject = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                status: "NOT_STARTED", // Default status for new projects
                organizationId: organizationId,
                User: userIds ? {
                    connect: userIds.map(id => ({ id }))
                } : undefined
            },
            include: {
                User: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                }
            }
        });

        return newProject;
    } catch (error) {
        console.error("Error creating project:", error);
        throw new Error("Failed to create project");
    }
}

export async function assignUserToProject(projectId: number, userId: string, organizationId: number): Promise<Project> {
    try {
        // Check if user exists and belongs to the organization
        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                organizationId: organizationId,
                role: "EMPLOYEE"
            }
        });

        if (!user) {
            throw new Error("User not found or not an employee of this organization");
        }

        // Check if project exists and belongs to the organization
        const project = await prisma.project.findFirst({
            where: {
                id: projectId,
                organizationId: organizationId
            }
        });

        if (!project) {
            throw new Error("Project not found or does not belong to this organization");
        }

        // Assign user to project
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId
            },
            data: {
                User: {
                    connect: {
                        id: userId
                    }
                }
            },
            include: {
                User: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                }
            }
        });

        return updatedProject;
    } catch (error) {
        console.error("Error assigning user to project:", error);
        throw new Error("Failed to assign user to project");
    }
}

export async function updateProject(
    projectId: number,
    organizationId: number,
    data: UpdateProjectDTO
): Promise<Project> {
    try {
        // Check if project exists and belongs to organization
        const existingProject = await prisma.project.findFirst({
            where: {
                id: projectId,
                organizationId: organizationId
            }
        });

        if (!existingProject) {
            throw new Error("Project not found or does not belong to this organization");
        }

        // Only include fields that are provided in the update data
        const updateData: Partial<UpdateProjectDTO> = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.startDate !== undefined) updateData.startDate = data.startDate;
        if (data.endDate !== undefined) updateData.endDate = data.endDate;
        if (data.status !== undefined) updateData.status = data.status;

        // Update project only with provided fields
        const updatedProject = await prisma.project.update({
            where: {
                id: projectId
            },
            data: updateData,
            include: {
                User: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true
                    }
                }
            }
        });

        return updatedProject;
    } catch (error) {
        console.error("Error updating project:", error);
        throw new Error("Failed to update project");
    }
}

export async function addWorkflow(
    projectId: number,
    organizationId: number,
    data: { name: string; description: string }
): Promise<Workflow> {
    try {
        // Check if project exists and belongs to organization
        const existingProject = await prisma.project.findFirst({
            where: {
                id: projectId,
                organizationId: organizationId
            }
        });

        if (!existingProject) {
            throw new Error("Project not found or does not belong to this organization");
        }

        // Create new workflow
        const newWorkflow = await prisma.workflow.create({
            data: {
                name: data.name,
                description: data.description,
                organizationId: organizationId,
                projectId: projectId
            }
        });

        return newWorkflow;
    } catch (error) {
        console.error("Error adding workflow:", error);
        throw new Error("Failed to add workflow");
    }
}


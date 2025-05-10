import { User } from "../users/model";

type Status = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "PENDING";

export interface Project {
    id: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: Status;
    organizationId: number;
    users?: User[];
}

export interface CreateProjectDTO {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: Status;
}

export interface UpdateProjectDTO {
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status?: Status;
}

export interface AssignUserDTO {
    projectId: number;
    userId: string;
}

export interface Workflow {
    id: number;
    name: string;
    description: string;
    organizationId: number;
    projectId: number;
}
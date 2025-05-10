type Status = "NOT_STARTED" | "IN_PROGRESS" | "PENDING" | "COMPLETED" | "OVERDUE";

export interface Task {
    id: number;
    name: string;
    description: string;
    status: Status;
    assignees: {
        id: string;
        email: string;
        name: string;
        role: string;
    }[];
    projectId: number;
    workflowId: number;
    dependencies: {
        id: number;
        name: string;
        description: string;
        status: Status;
        projectId: number;
        workflowId: number;
    }[];
}

export interface CreateTaskDTO {
    name: string;
    description: string;
    projectId: number;
    workflowId: number;
    dependencies?: number[];
}

export interface UpdateTaskStatusDTO {
    status: Status;
}

export interface AssignTaskDTO {
    taskId: number;
    assigneeIds: string[];
}

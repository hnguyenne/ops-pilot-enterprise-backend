export interface Organization {
    id: number;
    name: string;
    description: string;
    createdAt?: Date; // Optional if not always returned
}
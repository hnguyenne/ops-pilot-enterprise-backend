import { api } from "encore.dev/api";
import { createOrganization, getOrganizationById } from "./service";
import { Organization } from "./model";

export const createOrg = api(
    {
        method: "POST",
    },
    async ({ name, description }: { name: string; description: string }): Promise<Organization> => {
        try {
            const newOrg = await createOrganization(name, description);
            return newOrg;
        } catch (error) {
            console.error("Error creating organization:", error);
            throw error;
        }
    }
);

export const getOrg = api(
    {
        method: "GET",
    },
    async ({ id }: { id: number }): Promise<Organization> => {
        try {
            const org = await getOrganizationById(id);
            if (!org) {
                throw new Error("Organization not found");
            }
            return org;
        } catch (error) {
            console.error("Error fetching organization:", error);
            throw error;
        }
    }
);
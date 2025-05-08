-- AlterTable
CREATE SEQUENCE organization_id_seq;
ALTER TABLE "Organization" ALTER COLUMN "id" SET DEFAULT nextval('organization_id_seq');
ALTER SEQUENCE organization_id_seq OWNED BY "Organization"."id";

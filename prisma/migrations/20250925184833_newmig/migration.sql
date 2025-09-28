-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'EDITOR', 'HR');

-- CreateTable
CREATE TABLE "public"."AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."About" (
    "id" TEXT NOT NULL,
    "heading" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageId" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonial" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "role" TEXT,
    "quote" TEXT NOT NULL,
    "avatarId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Section" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "heading" TEXT,
    "content" TEXT,
    "imageId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "public"."AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Section_key_key" ON "public"."Section"("key");

-- AddForeignKey
ALTER TABLE "public"."About" ADD CONSTRAINT "About_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."News" ADD CONSTRAINT "News_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Section" ADD CONSTRAINT "Section_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "public"."Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `coureId` on the `Enrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentEmail,courseId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Enrollment" DROP CONSTRAINT "Enrollment_coureId_fkey";

-- AlterTable
ALTER TABLE "public"."Enrollment" DROP COLUMN "coureId",
ADD COLUMN     "courseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentEmail_courseId_key" ON "public"."Enrollment"("studentEmail", "courseId");

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "question_type" AS ENUM ('likert_scale', 'words');

-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('unknown', 'platform_administrator', 'health_board', 'hospital', 'department_manager', 'clinician');

-- CreateTable
CREATE TABLE "feedback" (
    "user_id" TEXT NOT NULL,
    "department_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "comments" TEXT,

    PRIMARY KEY ("user_id","timestamp")
);

-- CreateTable
CREATE TABLE "hospitals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "health_board_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "default_url" TEXT NOT NULL,
    "standard_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "type" "question_type" NOT NULL,
    "archived" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "department_id" INTEGER NOT NULL,
    "is_mentoring_session" BOOLEAN NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "response_id" INTEGER NOT NULL,
    "standard_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    PRIMARY KEY ("response_id","standard_id")
);

-- CreateTable
CREATE TABLE "standards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user_type" "user_type" DEFAULT E'unknown',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "response_id" INTEGER NOT NULL,
    "word" TEXT NOT NULL,
    "question_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_boards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hospital_id" INTEGER NOT NULL,
    "archived" BOOLEAN DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_urls" (
    "question_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    PRIMARY KEY ("question_id","department_id")
);

-- CreateTable
CREATE TABLE "clinician_join_codes" (
    "department_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "department_join_codes" (
    "department_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    PRIMARY KEY ("department_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinician_join_codes_department_id_unique" ON "clinician_join_codes"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_join_codes_department_id_unique" ON "department_join_codes"("department_id");

-- AddForeignKey
ALTER TABLE "feedback" ADD FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hospitals" ADD FOREIGN KEY ("health_board_id") REFERENCES "health_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD FOREIGN KEY ("standard_id") REFERENCES "standards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD FOREIGN KEY ("response_id") REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD FOREIGN KEY ("standard_id") REFERENCES "standards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "words" ADD FOREIGN KEY ("response_id") REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD FOREIGN KEY ("hospital_id") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_urls" ADD FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_urls" ADD FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinician_join_codes" ADD FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_join_codes" ADD FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

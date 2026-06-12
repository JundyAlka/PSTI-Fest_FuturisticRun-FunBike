-- CreateTable
CREATE TABLE "participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reg_number" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "full_name" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birth_place" TEXT NOT NULL,
    "birth_date" DATETIME NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "jersey_size" TEXT NOT NULL,
    "bib_name" TEXT NOT NULL,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "blood_type" TEXT,
    "medical_history" TEXT,
    "running_club" TEXT,
    "payment_method" TEXT,
    "payment_status" TEXT NOT NULL DEFAULT 'pending',
    "payment_proof_url" TEXT,
    "payment_amount" INTEGER NOT NULL,
    "verified_at" DATETIME,
    "verified_by" TEXT,
    "rejection_notes" TEXT,
    "bib_number" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'registered'
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "event_settings" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_reg_number_key" ON "participants"("reg_number");

-- CreateIndex
CREATE UNIQUE INDEX "participants_bib_number_key" ON "participants"("bib_number");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

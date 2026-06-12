-- Multi-Event Foundation (SQLite migration)
-- CreateTable: events
CREATE TABLE "events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT,
    "is_open" BOOLEAN NOT NULL DEFAULT true,
    "event_date" DATETIME,
    "location" TEXT,
    "deadline" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable: event_categories
CREATE TABLE "event_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quota" INTEGER NOT NULL,
    "min_age" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "event_categories_event_type_fkey" FOREIGN KEY ("event_type") REFERENCES "events" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables: event_settings (add id, event_type; change unique constraint)
CREATE TABLE "new_event_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "event_type" TEXT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_event_settings" ("key", "value", "updated_at") SELECT "key", "value", "updated_at" FROM "event_settings";
DROP TABLE "event_settings";
ALTER TABLE "new_event_settings" RENAME TO "event_settings";
CREATE UNIQUE INDEX "event_settings_event_type_key_key" ON "event_settings"("event_type", "key");

-- RedefineTables: participants (add event_type, rename paymentProofUrl->paymentProof, rejectionNotes->rejectionReason)
CREATE TABLE "new_participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reg_number" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "event_type" TEXT NOT NULL DEFAULT 'futuristic-run',
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
    "payment_proof" TEXT,
    "payment_amount" INTEGER NOT NULL,
    "verified_at" DATETIME,
    "verified_by" TEXT,
    "rejection_reason" TEXT,
    "bib_number" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'registered'
);
INSERT INTO "new_participants" ("id","reg_number","created_at","updated_at","full_name","nik","gender","birth_place","birth_date","phone","email","address","city","province","category","jersey_size","bib_name","emergency_contact_name","emergency_contact_phone","blood_type","medical_history","running_club","payment_method","payment_status","payment_amount","verified_at","verified_by","bib_number","status")
SELECT "id","reg_number","created_at","updated_at","full_name","nik","gender","birth_place","birth_date","phone","email","address","city","province","category","jersey_size","bib_name","emergency_contact_name","emergency_contact_phone","blood_type","medical_history","running_club","payment_method","payment_status","payment_amount","verified_at","verified_by","bib_number","status" FROM "participants";
DROP TABLE "participants";
ALTER TABLE "new_participants" RENAME TO "participants";
CREATE UNIQUE INDEX "participants_reg_number_key" ON "participants"("reg_number");
CREATE UNIQUE INDEX "participants_bib_number_key" ON "participants"("bib_number");

-- CreateIndex: unique on event_categories
CREATE UNIQUE INDEX "event_categories_event_type_code_key" ON "event_categories"("event_type", "code");

-- CreateIndex: unique on events slug
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

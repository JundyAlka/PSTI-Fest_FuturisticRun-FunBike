-- Sprint F schema sync
-- NIK is optional, jersey size supports XXXL in app validation, and Fun Bike gets bike_type.

PRAGMA foreign_keys=OFF;

CREATE TABLE "new_participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reg_number" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "event_type" TEXT NOT NULL DEFAULT 'futuristic-run',
    "full_name" TEXT NOT NULL,
    "nik" TEXT,
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
    "bike_type" TEXT,
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

INSERT INTO "new_participants" (
    "id","reg_number","created_at","updated_at","event_type","full_name","nik","gender","birth_place","birth_date",
    "phone","email","address","city","province","category","jersey_size","bib_name","emergency_contact_name",
    "emergency_contact_phone","blood_type","medical_history","running_club","bike_type","payment_method",
    "payment_status","payment_proof","payment_amount","verified_at","verified_by","rejection_reason","bib_number","status"
)
SELECT
    "id","reg_number","created_at","updated_at","event_type","full_name",NULLIF("nik", ''),"gender","birth_place","birth_date",
    "phone","email","address","city","province","category","jersey_size","bib_name","emergency_contact_name",
    "emergency_contact_phone","blood_type","medical_history","running_club",
    CASE WHEN "event_type" = 'fun-bike' THEN "running_club" ELSE NULL END,
    "payment_method","payment_status","payment_proof","payment_amount","verified_at","verified_by","rejection_reason","bib_number","status"
FROM "participants";

DROP TABLE "participants";
ALTER TABLE "new_participants" RENAME TO "participants";

CREATE UNIQUE INDEX "participants_reg_number_key" ON "participants"("reg_number");
CREATE UNIQUE INDEX "participants_bib_number_key" ON "participants"("bib_number");

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

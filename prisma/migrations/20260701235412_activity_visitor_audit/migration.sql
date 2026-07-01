-- AlterTable
ALTER TABLE "participants" ADD COLUMN "paid_at" DATETIME;
ALTER TABLE "participants" ADD COLUMN "payment_proof_key" TEXT;
ALTER TABLE "participants" ADD COLUMN "payment_proof_mime" TEXT;
ALTER TABLE "participants" ADD COLUMN "payment_proof_name" TEXT;
ALTER TABLE "participants" ADD COLUMN "payment_proof_size" INTEGER;
ALTER TABLE "participants" ADD COLUMN "registration_access_token_hash" TEXT;

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_type" TEXT NOT NULL DEFAULT 'system',
    "actor_label" TEXT,
    "event_type" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "page_url" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" TEXT NOT NULL DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "visitor_sessions" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "first_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_type" TEXT,
    "current_path" TEXT,
    "referrer" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "device_type" TEXT,
    "registered" BOOLEAN NOT NULL DEFAULT false,
    "registration_number" TEXT,
    "page_views" INTEGER NOT NULL DEFAULT 1,
    "metadata" TEXT NOT NULL DEFAULT '{}'
);

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "activity_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "activity_logs_event_type_action_created_at_idx" ON "activity_logs"("event_type", "action", "created_at" DESC);

-- CreateIndex
CREATE INDEX "visitor_sessions_last_seen_at_idx" ON "visitor_sessions"("last_seen_at" DESC);

-- CreateIndex
CREATE INDEX "visitor_sessions_event_type_registered_last_seen_at_idx" ON "visitor_sessions"("event_type", "registered", "last_seen_at" DESC);

-- Partial unique index to prevent duplicate system ItemType rows.
-- The @@unique([name, userId]) constraint allows multiple NULL userId rows
-- because PostgreSQL treats NULL != NULL in unique indexes.
-- This index enforces uniqueness for system types (userId IS NULL) specifically.
CREATE UNIQUE INDEX IF NOT EXISTS itemtype_system_name_unique
  ON "ItemType" (name) WHERE "userId" IS NULL;

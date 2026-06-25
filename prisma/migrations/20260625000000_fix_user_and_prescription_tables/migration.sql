-- Fix users table: add location column and update role enum to include CONSULTANT
SET @dbname = DATABASE();

-- Add location column to users if not exists
SET @tablename = "users";
SET @columnname = "location";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `location` VARCHAR(191) NULL;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check if role enum needs to be updated (add CONSULTANT)
-- First, get current enum values
SET @enum_values = NULL;
SELECT
  GROUP_CONCAT(CONCAT("'", COLUMN_TYPE, "'"))
INTO @enum_values
FROM
  INFORMATION_SCHEMA.COLUMNS
WHERE
  table_schema = @dbname
  AND table_name = 'users'
  AND column_name = 'role';

-- Modify role column to include CONSULTANT
SET @preparedStatement = CONCAT(
  "ALTER TABLE `users` MODIFY COLUMN `role` ENUM('SUPER_ADMIN', 'EDITOR', 'AUDITOR', 'CONSULTANT') NOT NULL DEFAULT 'EDITOR';"
);
PREPARE modifyEnum FROM @preparedStatement;
EXECUTE modifyEnum;
DEALLOCATE PREPARE modifyEnum;

-- Fix prescription_submissions table: add consultantId column and foreign key
SET @tablename = "prescription_submissions";
SET @columnname = "consultantId";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN `consultantId` VARCHAR(191) NULL;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add index for consultantId
SET @indexname = "prescription_submissions_consultantId_idx";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (index_name = @indexname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD INDEX `prescription_submissions_consultantId_idx`(`consultantId`);")
));
PREPARE addIndexIfNotExists FROM @preparedStatement;
EXECUTE addIndexIfNotExists;
DEALLOCATE PREPARE addIndexIfNotExists;

-- Add foreign key for consultantId
SET @constraintName = "prescription_submissions_consultantId_fkey";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
   WHERE table_schema = @dbname 
     AND table_name = "prescription_submissions" 
     AND constraint_name = @constraintName) > 0,
  "SELECT 1",
  "ALTER TABLE `prescription_submissions` ADD CONSTRAINT `prescription_submissions_consultantId_fkey` FOREIGN KEY (`consultantId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;"
));
PREPARE addFkIfNotExists FROM @preparedStatement;
EXECUTE addFkIfNotExists;
DEALLOCATE PREPARE addFkIfNotExists;

-- Update prescription_templates default doctorName to "Medical Prescription"
-- First, check if the column exists
SET @tablename = "prescription_templates";
SET @columnname = "doctorName";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_schema = @dbname)
      AND (table_name = @tablename)
      AND (column_name = @columnname)
  ) > 0,
  "ALTER TABLE `prescription_templates` ALTER COLUMN `doctorName` SET DEFAULT 'Medical Prescription';",
  "SELECT 1"
));
PREPARE updateDefault FROM @preparedStatement;
EXECUTE updateDefault;
DEALLOCATE PREPARE updateDefault;

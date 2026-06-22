-- CreateTable (if not exists)
SET @dbname = DATABASE();

-- admission_form_templates
SET @tablename = "admission_form_templates";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `admission_form_templates` (
    `id` VARCHAR(191) NOT NULL,
    `instituteName` VARCHAR(191) NOT NULL DEFAULT 'Care Institute of Health Sciences',
    `instituteAddress` VARCHAR(191) NOT NULL DEFAULT 'Plot 71-C, Satellite Town, Block-A, Rawalpindi',
    `instituteContact` VARCHAR(191) NOT NULL DEFAULT '0333-1165573',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- admission_form_submissions
SET @tablename = "admission_form_submissions";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `admission_form_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `instituteName` VARCHAR(191) NOT NULL,
    `instituteAddress` VARCHAR(191) NOT NULL,
    `instituteContact` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(191) NULL,
    `fatherName` VARCHAR(191) NULL,
    `dateOfBirth` VARCHAR(191) NULL,
    `cnicBFormNumber` VARCHAR(191) NULL,
    `domicileDistrict` VARCHAR(191) NULL,
    `permanentAddress` VARCHAR(191) NULL,
    `postalAddress` VARCHAR(191) NULL,
    `mobileNumber` VARCHAR(191) NULL,
    `photoUrl` TEXT NULL,
    `applicantSignatureUrl` TEXT NULL,
    `guardianSignatureUrl` TEXT NULL,
    `admissionGranted` BOOLEAN NULL,
    `admissionDenied` BOOLEAN NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `assignedNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- qualification_submissions
SET @tablename = "qualification_submissions";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `qualification_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `admissionFormSubmissionId` VARCHAR(191) NOT NULL,
    `degreeProgram` VARCHAR(191) NOT NULL,
    `scienceOrArts` VARCHAR(191) NULL,
    `totalMarks` VARCHAR(191) NULL,
    `marksObtained` VARCHAR(191) NULL,
    `percentage` VARCHAR(191) NULL,
    `physicsMarks` VARCHAR(191) NULL,
    `chemistryMarks` VARCHAR(191) NULL,
    `biologyMarks` VARCHAR(191) NULL,
    `scienceTotal` VARCHAR(191) NULL,
    `sciencePercentage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `qualification_submissions_admissionFormSubmissionId_idx`(`admissionFormSubmissionId`),
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- nursing_fee_structure_templates
SET @tablename = "nursing_fee_structure_templates";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `nursing_fee_structure_templates` (
    `id` VARCHAR(191) NOT NULL,
    `part1AdmissionFee` VARCHAR(191) NOT NULL DEFAULT '75000.00',
    `part1MonthlyFee` VARCHAR(191) NOT NULL DEFAULT '10000.00',
    `part1TotalFee` VARCHAR(191) NOT NULL DEFAULT '195000.00',
    `part2MonthlyFee` VARCHAR(191) NOT NULL DEFAULT '10000.00',
    `part2TotalFee` VARCHAR(191) NOT NULL DEFAULT '120000.00',
    `note` VARCHAR(191) NOT NULL DEFAULT 'All Fee are \"Non Refundable\"',
    `examFeeNote` VARCHAR(191) NOT NULL DEFAULT 'Examination Fee will be paid according to Nursing Council of Pakistan',
    `admissionCriteria` VARCHAR(191) NOT NULL DEFAULT 'Matric with Science\\n45% lverall',
    `ageLimit` VARCHAR(191) NOT NULL DEFAULT '35 years',
    `scholarship` VARCHAR(191) NOT NULL DEFAULT 'First 10 students will get 10% discount on Admission',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- paramedical_fee_structure_lab_templates
SET @tablename = "paramedical_fee_structure_lab_templates";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `paramedical_fee_structure_lab_templates` (
    `id` VARCHAR(191) NOT NULL,
    `part1AdmissionFee` VARCHAR(191) NOT NULL DEFAULT '30000.00',
    `part1MonthlyFee` VARCHAR(191) NOT NULL DEFAULT '5000.00',
    `part1TotalFee` VARCHAR(191) NOT NULL DEFAULT '90000.00',
    `part2MonthlyFee` VARCHAR(191) NOT NULL DEFAULT '5000.00',
    `part2TotalFee` VARCHAR(191) NOT NULL DEFAULT '60000.00',
    `note` VARCHAR(191) NOT NULL DEFAULT 'All Fee are \"Non Refundable\"',
    `examFeeNote` VARCHAR(191) NOT NULL DEFAULT 'Examination Fee will be paid according\\nto (Punjab Medical Faculty) / Federal\\nBoard',
    `admissionCriteria` VARCHAR(191) NOT NULL DEFAULT 'Matric with Science & Computer Science\\n40% lverall',
    `ageLimit` VARCHAR(191) NOT NULL DEFAULT 'No Age Limit',
    `scholarship` VARCHAR(191) NOT NULL DEFAULT 'First 10 students will get 10% discount on Admission',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- paramedical_fee_structure_mlt_templates
SET @tablename = "paramedical_fee_structure_mlt_templates";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `paramedical_fee_structure_mlt_templates` (
    `id` VARCHAR(191) NOT NULL,
    `part1AdmissionFee` VARCHAR(191) NOT NULL DEFAULT '30000.00',
    `part1MonthlyFee` VARCHAR(191) NOT NULL DEFAULT '5000.00',
    `part1TotalFee` VARCHAR(191) NOT NULL DEFAULT '90000.00',
    `part2MonthlyFee` VARCHAR(191) NOT NULL DEFAULT '5000.00',
    `part2TotalFee` VARCHAR(191) NOT NULL DEFAULT '60000.00',
    `note` VARCHAR(191) NOT NULL DEFAULT 'All Fee are \"Non Refundable\"',
    `examFeeNote` VARCHAR(191) NOT NULL DEFAULT 'Examination Fee will be paid according\\nto (Punjab Medical Faculty) / Federal\\nBoard',
    `admissionCriteria` VARCHAR(191) NOT NULL DEFAULT 'Matric with Science & Computer Science\\n40% iverall',
    `ageLimit` VARCHAR(191) NOT NULL DEFAULT 'No Age Limit',
    `scholarship` VARCHAR(191) NOT NULL DEFAULT 'First 10 students will get 10% discount on Admission',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- prescription_templates
SET @tablename = "prescription_templates";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `prescription_templates` (
    `id` VARCHAR(191) NOT NULL,
    `doctorName` VARCHAR(191) NOT NULL DEFAULT 'Dr. Kazim Raza',
    `doctorQualifications` VARCHAR(191) NOT NULL DEFAULT 'MBBS, &MP',
    `pmdcRegNumber` VARCHAR(191) NOT NULL DEFAULT '798414-01-M',
    `uidAmb` VARCHAR(191) NOT NULL DEFAULT 'UID/AMB 2026',
    `timings` VARCHAR(191) NOT NULL DEFAULT '05:00 pm to 09:00 pm',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- prescription_submissions
SET @tablename = "prescription_submissions";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `prescription_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `doctorName` VARCHAR(191) NOT NULL,
    `doctorQualifications` VARCHAR(191) NOT NULL,
    `pmdcRegNumber` VARCHAR(191) NOT NULL,
    `uidAmb` VARCHAR(191) NOT NULL,
    `timings` VARCHAR(191) NOT NULL,
    `patientName` VARCHAR(191) NULL,
    `patientAge` VARCHAR(191) NULL,
    `patientGender` VARCHAR(191) NULL,
    `date` VARCHAR(191) NULL,
    `rxContent` TEXT NULL,
    `adviceContent` TEXT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `assignedNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- nursing_fee_structure_submissions
SET @tablename = "nursing_fee_structure_submissions";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `nursing_fee_structure_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `part1AdmissionFee` VARCHAR(191) NOT NULL,
    `part1MonthlyFee` VARCHAR(191) NOT NULL,
    `part1TotalFee` VARCHAR(191) NOT NULL,
    `part2MonthlyFee` VARCHAR(191) NOT NULL,
    `part2TotalFee` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `examFeeNote` VARCHAR(191) NOT NULL,
    `admissionCriteria` VARCHAR(191) NOT NULL,
    `ageLimit` VARCHAR(191) NOT NULL,
    `scholarship` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(191) NULL,
    `applicantContact` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `assignedNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- paramedical_fee_structure_lab_submissions
SET @tablename = "paramedical_fee_structure_lab_submissions";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `paramedical_fee_structure_lab_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `part1AdmissionFee` VARCHAR(191) NOT NULL,
    `part1MonthlyFee` VARCHAR(191) NOT NULL,
    `part1TotalFee` VARCHAR(191) NOT NULL,
    `part2MonthlyFee` VARCHAR(191) NOT NULL,
    `part2TotalFee` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `examFeeNote` VARCHAR(191) NOT NULL,
    `admissionCriteria` VARCHAR(191) NOT NULL,
    `ageLimit` VARCHAR(191) NOT NULL,
    `scholarship` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(191) NULL,
    `applicantContact` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `assignedNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- paramedical_fee_structure_mlt_submissions
SET @tablename = "paramedical_fee_structure_mlt_submissions";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = @dbname AND table_name = @tablename) > 0,
  "SELECT 1",
  "CREATE TABLE `paramedical_fee_structure_mlt_submissions` (
    `id` VARCHAR(191) NOT NULL,
    `part1AdmissionFee` VARCHAR(191) NOT NULL,
    `part1MonthlyFee` VARCHAR(191) NOT NULL,
    `part1TotalFee` VARCHAR(191) NOT NULL,
    `part2MonthlyFee` VARCHAR(191) NOT NULL,
    `part2TotalFee` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `examFeeNote` VARCHAR(191) NOT NULL,
    `admissionCriteria` VARCHAR(191) NOT NULL,
    `ageLimit` VARCHAR(191) NOT NULL,
    `scholarship` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(191) NULL,
    `applicantContact` VARCHAR(191) NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `assignedNotes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
  ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key (if not exists)
SET @constraintName = "qualification_submissions_admissionFormSubmissionId_fkey";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
   WHERE table_schema = @dbname 
     AND table_name = "qualification_submissions" 
     AND constraint_name = @constraintName) > 0,
  "SELECT 1",
  "ALTER TABLE `qualification_submissions` ADD CONSTRAINT `qualification_submissions_admissionFormSubmissionId_fkey` FOREIGN KEY (`admissionFormSubmissionId`) REFERENCES `admission_form_submissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;"
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

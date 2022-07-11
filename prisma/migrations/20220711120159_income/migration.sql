/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Expense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `categoryId` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Expense` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `ExpenseValue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `expenseId` on the `ExpenseValue` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `ExpenseValue` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- CreateTable
CREATE TABLE "Income" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "defaultValue" DECIMAL NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "repeatingMonths" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "IncomeValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "incomeId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DECIMAL NOT NULL,
    CONSTRAINT "IncomeValue_incomeId_fkey" FOREIGN KEY ("incomeId") REFERENCES "Income" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id", "name") SELECT "id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "paymentType" INTEGER NOT NULL,
    "duedate" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" DECIMAL,
    "repeatingMonths" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("active", "categoryId", "createdAt", "defaultValue", "description", "duedate", "id", "paymentType", "updatedAt") SELECT "active", "categoryId", "createdAt", "defaultValue", "description", "duedate", "id", "paymentType", "updatedAt" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE TABLE "new_ExpenseValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expenseId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DECIMAL NOT NULL,
    CONSTRAINT "ExpenseValue_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExpenseValue" ("expenseId", "id", "month", "value", "year") SELECT "expenseId", "id", "month", "value", "year" FROM "ExpenseValue";
DROP TABLE "ExpenseValue";
ALTER TABLE "new_ExpenseValue" RENAME TO "ExpenseValue";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

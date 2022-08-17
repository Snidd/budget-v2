/*
  Warnings:

  - Added the required column `expenseId` to the `ExpenseValue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isIncome" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Category" ("id", "name", "order") SELECT "id", "name", "order" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_ExpenseValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comment" TEXT NOT NULL DEFAULT '',
    "value" DECIMAL NOT NULL,
    "monthId" INTEGER,
    "expenseId" INTEGER NOT NULL,
    CONSTRAINT "ExpenseValue_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "ExpenseMonth" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ExpenseValue_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExpenseValue" ("comment", "id", "monthId", "value") SELECT "comment", "id", "monthId", "value" FROM "ExpenseValue";
DROP TABLE "ExpenseValue";
ALTER TABLE "new_ExpenseValue" RENAME TO "ExpenseValue";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

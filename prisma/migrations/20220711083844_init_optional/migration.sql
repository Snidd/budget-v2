-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    "paymentType" INTEGER NOT NULL,
    "duedate" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" DECIMAL,
    CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("active", "categoryId", "createdAt", "defaultValue", "description", "duedate", "id", "paymentType", "updatedAt") SELECT "active", "categoryId", "createdAt", "defaultValue", "description", "duedate", "id", "paymentType", "updatedAt" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateTable
CREATE TABLE "Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "paymentType" INTEGER NOT NULL,
    "duedate" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "defaultValue" DECIMAL,
    "isIncome" BOOLEAN NOT NULL DEFAULT false,
    "repeatingMonths" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Expense_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExpenseMonth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "comment" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "ExpenseValue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "comment" TEXT NOT NULL DEFAULT '',
    "value" DECIMAL,
    "monthId" INTEGER,
    "expenseId" INTEGER NOT NULL,
    CONSTRAINT "ExpenseValue_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "ExpenseMonth" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ExpenseValue_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isIncome" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT NOT NULL DEFAULT 'rgb(31, 41, 55)'
);

-- CreateTable
CREATE TABLE "_ExpenseToMonth" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ExpenseToMonth_A_fkey" FOREIGN KEY ("A") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ExpenseToMonth_B_fkey" FOREIGN KEY ("B") REFERENCES "ExpenseMonth" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseMonth_month_year_key" ON "ExpenseMonth"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseValue_monthId_expenseId_key" ON "ExpenseValue"("monthId", "expenseId");

-- CreateIndex
CREATE UNIQUE INDEX "_ExpenseToMonth_AB_unique" ON "_ExpenseToMonth"("A", "B");

-- CreateIndex
CREATE INDEX "_ExpenseToMonth_B_index" ON "_ExpenseToMonth"("B");

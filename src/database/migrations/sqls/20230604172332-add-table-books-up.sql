CREATE TABLE IF NOT EXISTS `books` (
        `id` INTEGER PRIMARY KEY AUTOINCREMENT,
        `title` TEXT NOT NULL,
        `synopsis` TEXT,
        `author` TEXT NOT NULL,
        `price` INTEGER NOT NULL, -- Price contains two decimal points and is multiplied by 100 to remove decimal points.
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `idx_books_title` ON `books`(`title`);

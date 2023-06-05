CREATE TABLE IF NOT EXISTS `orders`(
	`id` INTEGER PRIMARY KEY AUTOINCREMENT,
	`user_id` INTEGER NOT NULL,
	`grand_total` INTEGER NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

CREATE TABLE IF NOT EXISTS `orders_details`(
	`order_id` INTEGER NOT NULL, 
	`book_id` INTEGER NOT NULL,
	`selling_price` INTEGER NOT NULL,
	`qty` INTEGER NOT NULL,
	`subtotal` INTEGER NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`),
	FOREIGN KEY (`book_id`) REFERENCES `books`(`id`),
    PRIMARY KEY(`order_id`, `book_id`)
);

-- Version 1.0 --
-- 5/15th/21 --
--<----------> --
--Create tables --
CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT current_timestamp()
);
CREATE TABLE `categories` (
  `id` int NOT NULL,
  `category` varchar(50) NOT NULL
);
CREATE TABLE `comments` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` text NOT NULL,
  `star` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `descriptions` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `color` varchar(60) DEFAULT NULL,
  `brand` varchar(60) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `weigth` varchar(60) DEFAULT NULL,
  `other` text
);
CREATE TABLE `products` (
  `id` int NOT NULL,
  `picture_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(250) NOT NULL,
  `price` float(10, 2) NOT NULL,
  `stock` int NOT NULL,
  `about` text NOT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `questions` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `question` text NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `sellers` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `direction` varchar(250) NOT NULL,
  `rank` int NOT NULL,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE `test` (
  `id` int NOT NULL,
  `content` varchar(250) DEFAULT NULL
);
CREATE TABLE `users` (
  `id` int NOT NULL,
  `names` varchar(60) NOT NULL,
  `last_names` varchar(60) NOT NULL,
  `email` varchar(140) NOT NULL,
  `password` varchar(140) NOT NULL,
  `sex` int NOT NULL COMMENT '0:women, 1:men, 2:other',
  `direction` varchar(140) DEFAULT NULL,
  `cart` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `birthday` timestamp NOT NULL,
  `type` int NOT NULL DEFAULT '0' COMMENT '0: Client, 1: Seller, 2: Admin',
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
--Add primary--
ALTER TABLE `answers`
ADD PRIMARY KEY (`id`);
ALTER TABLE `categories`
ADD PRIMARY KEY (`id`);
ALTER TABLE `comments`
ADD PRIMARY KEY (`id`); 
ALTER TABLE `descriptions`
ADD PRIMARY KEY (`id`);
ALTER TABLE `products`
ADD PRIMARY KEY (`id`);
ALTER TABLE `questions`
ADD PRIMARY KEY (`id`);
ALTER TABLE `sellers`
ADD PRIMARY KEY (`id`);
ALTER TABLE `test`
ADD PRIMARY KEY (`id`);
ALTER TABLE `users`
ADD PRIMARY KEY (`id`);
--Modify--
ALTER TABLE `answers`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `categories`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `comments`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `descriptions`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `products`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `questions`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `sellers`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `test`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `users`
MODIFY `id` int NOT NULL AUTO_INCREMENT;
--End Version 1.0 --
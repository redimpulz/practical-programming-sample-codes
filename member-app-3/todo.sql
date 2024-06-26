CREATE TABLE `user` (
  `uid` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `todo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` int NOT NULL,
  `task` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `uid` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `todo` ADD FOREIGN KEY (`uid`) REFERENCES `user`(`uid`);
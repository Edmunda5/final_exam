CREATE TABLE `admin_users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`password` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)

CREATE TABLE `events` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`date` VARCHAR(10) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)

CREATE TABLE `members` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`firstname` VARCHAR(200) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`lastname` VARCHAR(200) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`event` INT(11) NOT NULL DEFAULT '0',
	`email` VARCHAR(100) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci',
	`dob` VARCHAR(50) NOT NULL DEFAULT '0' COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `event_id` (`event`) USING BTREE,
	CONSTRAINT `event_id` FOREIGN KEY (`event`) REFERENCES `events` (`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
)

INSERT INTO `admin_users` (`id`, `username`, `password`) VALUES (1, 'admin', 'admin123');
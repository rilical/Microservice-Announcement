
CREATE TABLE `Announcement` (
  `announcement_id` integer PRIMARY KEY,
  `announcement_title` varchar(255),
  `announcement_body` varchar(255),
  `record_date` timestamp,
  `publish_date` timestamp,
  `expire_date` timestamp,
  `pinned` boolean default 0,
  `published` boolean default 0,
  `platform_id` integer
);

CREATE TABLE `Platform` (
  `platform_id` integer PRIMARY KEY,
  `platform_name` varchar(255),
  `platform_description` varchar(255),
  `enabled` boolean default true,
  `cors_domains` varchar(255)
);

CREATE TABLE `Domains` (
  `domain_id` integer  AUTO_INCREMENT PRIMARY KEY,
  `domain_name` varchar(255),
  `platform_id` integer
);

ALTER TABLE `Announcement` ADD FOREIGN KEY (`platform_id`) REFERENCES `Platform` (`platform_id`);

ALTER TABLE `Domains` ADD FOREIGN KEY (`platform_id`) REFERENCES `Platform` (`platform_id`);


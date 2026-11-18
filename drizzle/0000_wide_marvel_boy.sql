CREATE TABLE `multiplayer_rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL
);

CREATE TABLE `multiplayer_results` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`score` integer NOT NULL,
	`correct` integer NOT NULL,
	`level_id` text NOT NULL,
	`played_at` integer NOT NULL
);

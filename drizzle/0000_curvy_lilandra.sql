CREATE TABLE `public_session_guests` (
	`session_code` text NOT NULL,
	`player_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`name` text NOT NULL,
	`build_id` text NOT NULL,
	`starting_class` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`session_code`, `player_id`),
	FOREIGN KEY (`session_code`) REFERENCES `public_sessions`(`code`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `public_session_rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `public_sessions` (
	`code` text PRIMARY KEY NOT NULL,
	`host_token_hash` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`mode` text NOT NULL,
	`player_count` integer NOT NULL,
	`expedition` text,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL
);

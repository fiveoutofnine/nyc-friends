CREATE TABLE "images" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"text" text NOT NULL,
	"index" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);

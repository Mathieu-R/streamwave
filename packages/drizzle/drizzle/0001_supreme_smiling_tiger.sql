CREATE TABLE "database_seed" (
	"name" varchar PRIMARY KEY NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL
);

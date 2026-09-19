CREATE TYPE "public"."provider" AS ENUM('LOCAL', 'GOOGLE', 'GITHUB');--> statement-breakpoint
CREATE TABLE "album" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"artist" varchar NOT NULL,
	"genre" varchar NOT NULL,
	"year" smallint NOT NULL,
	"cover_url" varchar NOT NULL,
	"primary_color_r" smallint NOT NULL,
	"primary_color_g" smallint NOT NULL,
	"primary_color_b" smallint NOT NULL,
	"owner_id" integer,
	CONSTRAINT "album_primary_color_r_check" CHECK ("album"."primary_color_r" between 0 and 255),
	CONSTRAINT "album_primary_color_g_check" CHECK ("album"."primary_color_g" between 0 and 255),
	CONSTRAINT "album_primary_color_b_check" CHECK ("album"."primary_color_b" between 0 and 255)
);
--> statement-breakpoint
CREATE TABLE "playlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlist_track" (
	"playlist_id" integer NOT NULL,
	"track_id" integer NOT NULL,
	CONSTRAINT "playlist_track_playlist_id_track_id_pk" PRIMARY KEY("playlist_id","track_id")
);
--> statement-breakpoint
CREATE TABLE "track" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" smallint NOT NULL,
	"title" varchar NOT NULL,
	"artist" varchar NOT NULL,
	"duration" integer NOT NULL,
	"manifest_url" varchar NOT NULL,
	"playlist_url" varchar NOT NULL,
	"audio_128_url" varchar NOT NULL,
	"audio_192_url" varchar NOT NULL,
	"audio_256_url" varchar NOT NULL,
	"album_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstname" varchar NOT NULL,
	"lastname" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"avatar_url" varchar DEFAULT '/resources/assets/svg/avatar.svg' NOT NULL,
	"provider" "provider" NOT NULL,
	"email_verification_token" varchar,
	"email_verification_token_expired_at" timestamp,
	"email_verified" boolean DEFAULT false NOT NULL,
	"reset_password_token" varchar,
	"reset_password_token_expired_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_provider_unique" UNIQUE("email","provider")
);
--> statement-breakpoint
ALTER TABLE "album" ADD CONSTRAINT "album_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist" ADD CONSTRAINT "playlist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_track" ADD CONSTRAINT "playlist_track_playlist_id_playlist_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_track" ADD CONSTRAINT "playlist_track_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track" ADD CONSTRAINT "track_album_id_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE no action;
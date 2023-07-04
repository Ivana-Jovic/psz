CREATE TABLE IF NOT EXISTS "theta" (
	"id" serial PRIMARY KEY NOT NULL,
	"theta_zero" numeric,
	"size" numeric,
	"location" numeric,
	"year_of_construction" numeric,
	"floor" numeric,
	"num_of_bathrooms" numeric,
	"num_of_rooms" numeric,
	"registered" numeric,
	"elevator" numeric,
	"terrace" numeric,
	"parking" numeric,
	"garage" numeric
);

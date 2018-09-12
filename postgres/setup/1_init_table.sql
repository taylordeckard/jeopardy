CREATE TABLE questions (
	id				serial,
	category		varchar(120),
	air_date		varchar(50),
	question		varchar(1000),
	value			varchar(10),
	answer			varchar(200),
	round			varchar(25),
	show_number		int,
    isDailyDouble	boolean,
	year            int
);

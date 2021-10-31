COPY questions(air_date,answer,category,isDailyDouble,question,round,show_number,value,year)
FROM '/home/taylor/JEOPARDY.csv' DELIMITER ',' CSV HEADER;

COPY questions(air_date,answer,category,isDailyDouble,question,round,show_number,value,year)
FROM '/docker-entrypoint-initdb.d/JEOPARDY.csv' DELIMITER ',' CSV HEADER;

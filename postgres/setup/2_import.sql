COPY questions(category,air_date,question,value,answer,round,show_number) 
FROM '/docker-entrypoint-initdb.d/JEOPARDY_QUESTIONS1.csv' DELIMITER ',' CSV HEADER;

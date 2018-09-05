COPY questions(category,air_date,question,value,answer,round,show_number) 
FROM '/docker-entrypoint-initdb.d/JEOPARDY_QUESTIONS_edited.csv' DELIMITER ',' CSV HEADER;

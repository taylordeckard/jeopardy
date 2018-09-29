FROM nginx
COPY conf.d /etc/nginx/conf.d
COPY nginx.conf /etc/nginx/nginx.conf

COPY static /usr/share/nginx/html
RUN mkdir -p /usr/share/nginx/html/media
COPY media /usr/share/nginx/html/media

EXPOSE 1111

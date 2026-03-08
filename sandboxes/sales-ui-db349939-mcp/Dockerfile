FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh", "-c", "sed -i \"s/listen       80;/listen       ${PORT:-80};/\" /etc/nginx/conf.d/default.conf && sed -i \"s/listen  \\[::\\]:80;/listen  [::]:${PORT:-80};/\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

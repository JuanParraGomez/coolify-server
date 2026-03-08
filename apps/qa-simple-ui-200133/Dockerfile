FROM nginx:alpine

RUN apk add --no-cache curl

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "sed -i \"s/listen       80;/listen       ${PORT:-80};/\" /etc/nginx/conf.d/default.conf && sed -i \"s/listen  \\[::\\]:80;/listen  [::]:${PORT:-80};/\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD curl -fsS "http://127.0.0.1:${PORT:-80}/" >/dev/null || exit 1

FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
COPY logo-light.png /usr/share/nginx/html/logo-light.png
COPY logo-dark.png /usr/share/nginx/html/logo-dark.png
EXPOSE 80

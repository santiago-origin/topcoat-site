FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY contact-form.html /usr/share/nginx/html/contact-form.html
COPY privacy-policy.html /usr/share/nginx/html/privacy-policy.html
COPY tos.html /usr/share/nginx/html/tos.html
COPY logo-light.png /usr/share/nginx/html/logo-light.png
COPY logo-dark.png /usr/share/nginx/html/logo-dark.png
COPY favicon.png /usr/share/nginx/html/favicon.png
COPY favicon-32.png /usr/share/nginx/html/favicon-32.png
EXPOSE 80

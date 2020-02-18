FROM nginx:stable

COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY nginx.conf /usr/local/nginx/conf/nginx.conf
# COPY nginx.conf /usr/local/etc/nginx/nginx.conf 

# RUN apt-get update
# RUN apt-get install apache2-utils --assume-yes
# RUN mkdir /etc/nginx/auth_basic
# RUN htpasswd -c /etc/nginx/auth_basic/.htpasswd spartan
# RUN htpasswd -b /etc/nginx/auth_basic/.htpasswd spartan KillsDumbledore0731
# RUN chmod +x /etc/nginx/auth_basic

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM php:8.2-apache

# Instala extensões necessárias
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copia os arquivos do backend
COPY backend/ /var/www/html/

# Permite .htaccess
RUN a2enmod rewrite
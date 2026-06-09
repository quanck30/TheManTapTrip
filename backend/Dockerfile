FROM php:8.4-fpm

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    zip \
    unzip \
    git \
    curl \
    && apt-get clean
RUN docker-php-ext-install pdo pdo_mysql opcache

RUN pecl install redis \
    && docker-php-ext-enable redis

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/99-opcache-local.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .
RUN composer install --optimize-autoloader



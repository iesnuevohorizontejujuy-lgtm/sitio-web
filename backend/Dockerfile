# syntax=docker/dockerfile:1.7

FROM php:8.4-fpm-alpine AS php-base

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    LOG_LEVEL=info

RUN set -eux; \
    apk add --no-cache \
        curl \
        freetype \
        icu-libs \
        libjpeg-turbo \
        libpng \
        libpq \
        libzip \
        nginx \
        oniguruma \
        sqlite-libs; \
    apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        freetype-dev \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libzip-dev \
        oniguruma-dev \
        postgresql-dev \
        sqlite-dev; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    docker-php-ext-install -j"$(nproc)" \
        bcmath \
        exif \
        gd \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        zip; \
    apk del .build-deps; \
    mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

FROM composer:2 AS composer-bin

FROM php-base AS vendor

WORKDIR /app

COPY --from=composer-bin /usr/bin/composer /usr/local/bin/composer
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --optimize-autoloader \
    --prefer-dist

FROM node:22-alpine AS assets

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY --from=vendor /app/vendor ./vendor
COPY resources ./resources
COPY vite.config.js ./

RUN npm run build

FROM php-base AS runtime

WORKDIR /var/www/html

COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /app/vendor ./vendor
COPY --from=assets --chown=www-data:www-data /app/public/build ./public/build

COPY docker/php.ini "$PHP_INI_DIR/conf.d/99-app.ini"
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-app.conf
COPY docker/nginx /etc/nginx/http.d/default.conf
COPY docker/entrypoint /usr/local/bin/docker-entrypoint

RUN set -eux; \
    chmod +x /usr/local/bin/docker-entrypoint; \
    mkdir -p \
        bootstrap/cache \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs; \
    chown -R www-data:www-data bootstrap/cache storage; \
    php artisan package:discover --ansi; \
    php artisan filament:assets --ansi; \
    nginx -t; \
    php-fpm -tt

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl --fail --silent --show-error http://127.0.0.1:8080/up || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]
CMD ["nginx", "-g", "daemon off;"]

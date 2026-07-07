FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    postgresql-dev \
    postgresql-client \
    redis \
    icu-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libwebp-dev \
    imagemagick-dev \
    imagemagick-libs \
    msmtp \
    $PHPIZE_DEPS

RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        pgsql \
        intl \
        exif \
        gd

RUN pecl install redis \
    && docker-php-ext-enable redis

RUN pecl install imagick \
    && docker-php-ext-enable imagick

COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /var/www/html

ENTRYPOINT ["/entrypoint.sh"]

#!/bin/sh
set -eu

cd /var/www/html

mkdir -p \
    bootstrap/cache \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs

chown -R www-data:www-data bootstrap/cache storage

if [ -z "${APP_KEY:-}" ]; then
    echo "ERROR: APP_KEY debe configurarse en las variables de entorno de Dokploy." >&2
    exit 1
fi

php artisan storage:link --no-interaction >/dev/null 2>&1 || true

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    migration_attempt=1
    migration_attempts="${DB_MIGRATION_ATTEMPTS:-10}"

    until php artisan migrate --force --no-interaction; do
        if [ "$migration_attempt" -ge "$migration_attempts" ]; then
            echo "ERROR: no fue posible ejecutar las migraciones después de ${migration_attempts} intentos." >&2
            exit 1
        fi

        echo "La base de datos todavía no está disponible. Reintento ${migration_attempt}/${migration_attempts}..." >&2
        migration_attempt=$((migration_attempt + 1))
        sleep 3
    done
fi

php artisan config:cache --no-interaction
php artisan view:cache --no-interaction
php artisan filament:optimize --no-interaction

if [ "${1:-}" = "nginx" ]; then
    php-fpm --daemonize
fi

exec "$@"

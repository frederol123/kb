#!/bin/sh
set -e

# Загружаем .env в окружение shell (доступно для дочерних процессов)
if [ -f /app/.env ]; then
    set -a
    # shellcheck disable=SC2046
    . /app/.env
    set +a
fi

# Конфигурация msmtp для отправки почты через Postfix на хосте
cat > /etc/msmtprc << 'MSMTPEOF'
defaults
auth            off
tls             off

account         default
host            172.18.0.1
port            25
from            i.sales@immortal-code.ru
MSMTPEOF

# Ожидание PostgreSQL
echo "Waiting for PostgreSQL at ${DB_HOST:-kod-postgres}:${DB_PORT:-5432}..."
MAX_RETRIES=30
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if pg_isready -h "${DB_HOST:-kod-postgres}" -p "${DB_PORT:-5432}" \
        -U "${DB_USERNAME:-kod}" -d "${DB_DATABASE:-kod}" -q 2>/dev/null; then
        echo "PostgreSQL is ready."
        break
    fi
    RETRY=$((RETRY + 1))
    echo "PostgreSQL not ready yet (attempt $RETRY/$MAX_RETRIES)..."
    sleep 2
done

if [ $RETRY -ge $MAX_RETRIES ]; then
    echo "ERROR: PostgreSQL did not become ready after $MAX_RETRIES attempts."
    echo "Continuing anyway — Laravel may retry internally."
fi

# Ожидание Redis
echo "Waiting for Redis at ${REDIS_HOST:-kod-redis}:${REDIS_PORT:-6379}..."
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
    if redis-cli -h "${REDIS_HOST:-kod-redis}" -p "${REDIS_PORT:-6379}" ping 2>/dev/null | grep -q PONG; then
        echo "Redis is ready."
        break
    fi
    RETRY=$((RETRY + 1))
    echo "Redis not ready yet (attempt $RETRY/$MAX_RETRIES)..."
    sleep 2
done

# Миграции при старте (если таблиц нет — создаст)
php /app/artisan migrate --force 2>/dev/null || echo "Migration skipped or already up to date."

# Запуск PHP-FPM
exec php-fpm

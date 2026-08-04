#!/usr/bin/env bash
# Бэкап БД PostgreSQL → Yandex Object Storage (S3)
# Использование: backup-db.sh [keep_days]
set -euo pipefail

KEEP="${1:-14}"                       # сколько свежих копий хранить
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"
DUMP="/tmp/kod-db-${STAMP}.sql.gz"
LOG="/var/log/backup-s3.log"
RCLONE_REMOTE="yandex:immortal-code/db"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "=== DB backup start ==="

# Дамп из контейнера kod-postgres (БД kod, пользователь kod)
if ! docker exec kod-postgres pg_dump -U kod -d kod --no-owner | gzip > "$DUMP"; then
    log "ERROR: pg_dump failed"
    rm -f "$DUMP"
    exit 1
fi

SIZE=$(du -h "$DUMP" | cut -f1)
log "Dump created: $DUMP ($SIZE)"

# Загрузка в Yandex S3
if rclone copy "$DUMP" "$RCLONE_REMOTE" --s3-chunk-size 64M 2>>"$LOG"; then
    log "Uploaded to $RCLONE_REMOTE/$(basename "$DUMP")"
else
    log "ERROR: rclone copy failed"
    rm -f "$DUMP"
    exit 1
fi

rm -f "$DUMP"

# Ротация: оставляем KEEP последних дампов
if rclone lsf "$RCLONE_REMOTE" 2>>"$LOG" | sort | head -n -"$KEEP" | while read -r old; do
    rclone delete "$RCLONE_REMOTE/$old" 2>>"$LOG" && log "Rotated out: $old"
done; then
    :
fi

log "=== DB backup done ==="

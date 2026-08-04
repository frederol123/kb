#!/usr/bin/env bash
# Синхронизация файлов (фото/видео) из MinIO → Yandex Object Storage (S3)
# Инкрементально: копируются только изменения
set -euo pipefail

LOG="/var/log/backup-s3.log"
RCLONE_REMOTE="yandex:immortal-code/files"
MINIO_SRC="minio:kod-uploads"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "=== Files sync start ==="

if rclone sync "$MINIO_SRC" "$RCLONE_REMOTE" --s3-chunk-size 64M --transfers 4 2>>"$LOG"; then
    log "Files synced OK"
else
    log "ERROR: rclone sync failed"
    exit 1
fi

log "=== Files sync done ==="

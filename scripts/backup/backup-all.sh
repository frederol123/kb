#!/usr/bin/env bash
# Полный бэкап: БД + файлы → Yandex Object Storage
# Вызывается из cron: 0 3 * * * /root/backup/backup-all.sh
set -euo pipefail

LOG="/var/log/backup-s3.log"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG"; }

log "########## BACKUP-ALL START ##########"

"$DIR/backup-db.sh" "${1:-14}"
"$DIR/backup-files.sh"

log "########## BACKUP-ALL DONE ##########"

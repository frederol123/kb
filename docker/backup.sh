#!/bin/bash
# Kod backup script — dumps PostgreSQL from Docker
# Run: docker compose exec -T postgres ...

BACKUP_DIR="/var/backups/kod"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="$BACKUP_DIR/kod_$TIMESTAMP.sql.gz"

cd /var/www/kod

# Dump + compress
docker compose exec -T postgres pg_dump -U kod kod | gzip > "$DUMP_FILE"

# Cleanup old backups
find "$BACKUP_DIR" -name "kod_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "$(date): Backup saved to $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"

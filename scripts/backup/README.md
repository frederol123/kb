# Бэкапы в Yandex Object Storage

Автоматический бэкап БД PostgreSQL и файлов (фото/видео) в Yandex Cloud S3.

## Схема

| Источник | Куда (bucket `immortal-code`) | Когда |
|---|---|---|
| PostgreSQL (`kod-postgres`) | `db/kod-db-<дата>.sql.gz` | ежедневно 03:00, хранится 14 копий |
| MinIO (`kod-uploads`) | `files/` (зеркало) | ежедневно 03:00, инкрементально |

## Скрипты (на сервере: `/root/backup/`)

- `backup-db.sh` — pg_dump → gzip → загрузка в S3 + ротация (оставить N копий, по умолчанию 14)
- `backup-files.sh` — `rclone sync` MinIO → S3 (копируются только изменения)
- `backup-all.sh` — запуск обоих (вызывается из cron)

Лог: `/var/log/backup-s3.log`

## Конфигурация rclone (`/root/.config/rclone/rclone.conf`)

```ini
[yandex]
type = s3
provider = Other
access_key_id = <ключ>
secret_access_key = <секрет>
endpoint = https://storage.yandexcloud.net

[minio]
type = s3
provider = Other
access_key_id = minioadmin
secret_access_key = minioadmin_secret
endpoint = http://localhost:9000
use_path_style = true
```

**Ключи Яндекса НЕ хранятся в репозитории** — только в rclone.conf на сервере (права 600).

## Восстановление

### БД из бэкапа

```bash
# Скачать дамп
rclone copy yandex:immortal-code/db/kod-db-<дата>.sql.gz /tmp/

# Восстановить в контейнер (сначала остановить app, чтобы не писать в БД)
gunzip -c /tmp/kod-db-<дата>.sql.gz | docker exec -i kod-postgres psql -U kod -d kod
docker restart kod-app
```

### Файлы из бэкапа

```bash
# Синхронизация обратно в MinIO (осторожно: перезапишет текущее состояние)
rclone sync yandex:immortal-code/files/ minio:kod-uploads
```

## Ручной запуск

```bash
bash /root/backup/backup-all.sh      # полный бэкап
bash /root/backup/backup-db.sh 30    # БД, хранить 30 копий
```

## Проверка

```bash
rclone lsl yandex:immortal-code/db/          # список дампов
rclone size yandex:immortal-code/files/      # размер файлов
tail -20 /var/log/backup-s3.log              # статус последнего бэкапа
```

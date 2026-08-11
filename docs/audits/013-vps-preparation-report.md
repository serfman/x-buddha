# Отчёт о подготовке production VPS — задача 013

Дата проверки: 11 августа 2026 года. Целевой VPS: `178.212.14.78`.

## Исходный аудит

- Ubuntu 26.04 LTS, kernel 7.0, 2 vCPU.
- 3.3 GiB RAM, swap отсутствовал.
- Корневой ext4-раздел 30 GiB, свободно около 25 GiB.
- Снаружи приложений не было: слушал только SSH `22/tcp`; Docker, Compose, Nginx и Certbot отсутствовали.
- Сторонние production-сервисы, контейнеры и данные в стандартных production-каталогах не обнаружены.
- UFW был не настроен; SSH разрешал доступ по ключу и паролю.

Сервер соответствовал предположению о новом чистом VPS, поэтому подготовка была продолжена.

## Выполненная подготовка

- Установлены Docker Engine 29.1.3, Docker Compose 2.40.3, Nginx 1.28.3, Certbot 4.0.0, UFW и Git из репозиториев Ubuntu.
- Docker, Nginx и Certbot timer включены для запуска после reboot.
- Создан постоянный swap `/swapfile` размером 2 GiB, подключение добавлено в `/etc/fstab`.
- UFW включён с default deny incoming; разрешены только `22/tcp`, `80/tcp` и `443/tcp` для IPv4/IPv6.
- После двух независимых проверок key-based входа установлены `PasswordAuthentication no` и `PermitRootLogin prohibit-password`; root-доступ по ключу сохранён и повторно проверен.
- Официальный репозиторий размещён в `/opt/x-buddha`.
- Создан секретный `/opt/x-buddha/.env.production` с правами `600`; ключи и пароли сгенерированы независимо и не записаны в Git или документацию.
- Создан внешний backup-каталог `/srv/backups/x-buddha` с правами `700`.

## Production-схема

Host-level Nginx принимает публичный HTTP/HTTPS-трафик. Next.js публикуется только на `127.0.0.1:3000`, Directus — только на `127.0.0.1:8055`, PostgreSQL не публикует host port и доступен только в Docker network. PostgreSQL data и Directus uploads используют именованные persistent volumes.

До переключения DNS применяется только bootstrap server block Nginx для ACME challenge. Запросы к остальным путям получают `404`; HTTPS server blocks пока не включаются.

## Оставшиеся блокеры

- DNS у Hostinger не переключён. Нужны A-записи `@` и `admin` на `178.212.14.78`, CNAME `www` на `xbuddha.org`.
- Сертификат Let's Encrypt не выпускался до готовности DNS.
- Реальный ID Яндекс.Метрики не предоставлен; переменная остаётся пустой.
- Реальный RuTube URL и финальные юридические тексты ожидаются от заказчика.
- Публичный production deployment, внешний smoke-check и клиентская приёмка не объявлены завершёнными.

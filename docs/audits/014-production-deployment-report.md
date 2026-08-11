# Отчёт о production deployment — задача 014

Дата deployment: 11 августа 2026 года. Production VPS: `178.212.14.78`.

## Результат

- `https://xbuddha.org` опубликован через Nginx и standalone Next.js.
- `https://www.xbuddha.org` перенаправляет на canonical origin `https://xbuddha.org`.
- `https://admin.xbuddha.org` публикует Directus Studio и API.
- HTTP перенаправляется на HTTPS; единый сертификат Let's Encrypt для трёх имён действует до 9 ноября 2026 года.
- Certbot timer и deploy hook активны, `certbot renew --dry-run` завершён успешно.

## Состояние до изменения и rollback

- Исходный Git commit и rollback point: `e891f65c721eb5aaa75b960f06401226f7f03162`.
- Перед переключением Nginx созданы и проверены согласованные backup PostgreSQL и Directus uploads с меткой `20260811T100844Z`.
- Ранее созданные backup сохранены без изменений.

## Инфраструктура и persistence

- PostgreSQL, Directus и frontend достигли `healthy`; для всех сервисов действует `restart: unless-stopped`.
- Next.js доступен на хосте только через `127.0.0.1:3000`, Directus — через `127.0.0.1:8055`, PostgreSQL не имеет host port binding.
- После контролируемого restart контейнеров подтверждены admin authentication, коллекция `articles`, API, public policy и uploads-volume.
- Production Directus содержит 0 опубликованных статей; `/blog` корректно показывает пустое состояние, а отсутствие `/blog/[slug]` не считается ошибкой инфраструктуры.

## Smoke-check

- Проверены `/`, `/blog`, `sitemap.xml`, `robots.txt`, favicon и health endpoints сайта и Directus.
- Canonical, Open Graph, Twitter Card, JSON-LD, sitemap и robots используют `https://xbuddha.org`; ссылок на прежние `.ru`-домены нет.
- Ссылки Telegram, MAX и Directus admin присутствуют и ведут на production-адреса.
- На ширинах 360, 390, 768, 1024 и 1440 px проверены header, navigation, CTA, блок атрибуции, изображения, финальный экран, footer и admin link. Горизонтальный overflow и browser console errors не обнаружены; mobile menu и lazy loading изображений работают.
- RuTube остаётся согласованной временной заглушкой до получения реального URL.

## Security и health

- Извне доступны только 22, 80 и 443; порты 3000, 8055 и 5432 недоступны.
- UFW активен с default deny incoming и разрешениями только для SSH/HTTP/HTTPS.
- SSH password authentication и password-based root login остаются отключёнными.
- Swap 2 GiB активен; после deployment достаточно RAM и дискового пространства, restart loop и критические ошибки в Nginx/application logs не обнаружены.

Секреты, credentials и содержимое production env в отчёт не включены.

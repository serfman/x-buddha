# Финальная приёмка и передача X-Buddha

Дата проверки: 12 августа 2026 года. Production runtime commit на момент приёмки: `d0043e187011088b0d5260e1da5438ce15f1f211` (`main`). Документационные изменения задачи 020 не требуют пересборки или deployment runtime.

## Production URLs

- основной сайт: `https://xbuddha.org`;
- alias: `https://www.xbuddha.org` → 301 на основной домен;
- Directus Studio: `https://admin.xbuddha.org`.

## Проверенный объём

- Маршруты `/`, `/blog/`, `/blog/buddhist-sculpture-attribution/`, `/privacy/`, `robots.txt`, `sitemap.xml` и `/api/health/` возвращают HTTP 200. `/offer/` и неизвестный маршрут возвращают штатный 404.
- На главной подтверждены header, Hero и slider, принципы атрибуции, процесс оценки, Telegram/MAX CTA, RuTube preview и lazy player, финальный экран, footer, cookie consent и ссылка в admin.
- В production HTML и индексируемых маршрутах не обнаружены ссылки на старый `.ru`-домен, preview-домены, localhost или IP VPS. Основной canonical — `https://xbuddha.org`.
- Отдельный полный QA задачи 018/019 не повторялся: признаки регрессии отсутствуют.

## CMS

- Directus health endpoint возвращает `ok`, Studio открывается и показывает штатную форму входа. Пароли и другие credentials не использовались и в отчёт не включены.
- Существующая статья `buddhist-sculpture-attribution` доступна через минимальную public policy и опубликована. Подтверждены title, slug, excerpt (145 знаков), cover, rich content, дата публикации, SEO title и SEO description (148 знаков).
- Draft не раскрываются публичным API; создание тестовой статьи и сохранение изменений production-контента не выполнялись.
- Рабочий admin access, редактирование и draft/published workflow были проверены при production deployment и QA задач 014, 018 и 019; текущая схема и инструкция им соответствуют. Для владельца создано отдельное [простое руководство](../cms/client-guide.md).

## Infrastructure

- На VPS работают три контейнера: Next.js, Directus и PostgreSQL. Все имеют статус healthy, restart count `0` и policy `unless-stopped`.
- Nginx active, `nginx -t` успешен. Актуальных ошибок Nginx после стабильного deployment не обнаружено.
- Доступно около 2,1 GiB RAM; swap 2 GiB практически не используется. Корневой диск занят на 32%. Признаков memory pressure, restart loop или быстро растущих логов нет.
- Docker занимает около 3,8 GB images и 2,2 GB build cache; очистка не выполнялась, свободного места достаточно.
- Снаружи доступны только TCP 22, 80 и 443. Next.js слушает `127.0.0.1:3000`, Directus — `127.0.0.1:8055`, PostgreSQL не имеет опубликованного host port. UFW active с default deny incoming.
- Production checkout находится на `main` и commit `d0043e1`; рабочее дерево production чистое.

Исторические PostgreSQL errors в логах относятся к подготовке/контролируемым restart 11 августа и не повторяются в текущем стабильном runtime.

## SSL и DNS

- Единый сертификат Let's Encrypt покрывает `xbuddha.org`, `www.xbuddha.org` и `admin.xbuddha.org`, действителен до 9 ноября 2026 года.
- HTTP перенаправляется на HTTPS, `www` — на canonical. DNS указывает на production VPS.
- `certbot.timer` active/enabled. Безопасный `certbot renew --dry-run --no-random-sleep-on-renew` успешно симулировал renewal всех имён; deploy hook присутствует.

## Backup и restore readiness

- В `/srv/backups/x-buddha` присутствуют две согласованные пары PostgreSQL/uploads. Последние файлы непустые; PostgreSQL dump проходит `pg_restore -l`, uploads archive — `tar -tzf`.
- Успешный restore-test PostgreSQL во временную БД и проверка uploads archive зафиксированы в отчёте задачи 013. Production restore намеренно не выполнялся.
- Текущая процедура backup/restore в `DEPLOY.md` соответствует compose services, volumes и production paths.
- Регулярное автоматическое расписание и внешняя зашифрованная копия остаются задачей эксплуатации.

## Secrets

- В Git отслеживаются только шаблоны `.env.example` и `.env.production.example`; production env не отслеживается и имеет на VPS права `600`.
- Приватные SSH-ключи, пароли Directus/PostgreSQL и production credentials в отслеживаемой документации и изменениях задачи не обнаружены.

## Analytics

Production использует Яндекс.Метрику `111463994` после явного consent и отправляет события `messenger_telegram_click` и `messenger_max_click`. Ручное создание соответствующих целей в интерфейсе счётчика остаётся эксплуатационной задачей и не блокирует работу frontend-событий.

## Известные ограничения

- Формы и загрузка файлов отсутствуют; обращения и фотографии передаются через Telegram/MAX.
- Checkout, онлайн-оплата и публичная оферта отсутствуют по согласованной информационной модели сайта.
- CMS предназначена прежде всего для статей блога.
- Draft preview на публичном сайте не реализован; черновик проверяется в Directus и публикуется после редакторской проверки.

## Оставшиеся задачи поддержки

- создать две цели в интерфейсе Яндекс.Метрики;
- провести внешнюю юридическую проверку privacy/consent;
- автоматизировать регулярные backups и внешнюю копию.

Эти пункты не являются Critical/High-дефектами production и не блокируют передачу.

## Итоговый статус

`READY FOR HANDOVER`

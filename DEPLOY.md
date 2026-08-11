# Production deployment X-Buddha

Этот документ — единственная эксплуатационная инструкция для production-инфраструктуры X-Buddha. Production-стек опубликован 11 августа 2026 года на отдельном VPS `178.212.14.78`; результаты первого deployment и smoke-check зафиксированы в [отчёте задачи 014](docs/audits/014-production-deployment-report.md).

## Архитектура

```text
Internet
  └─ Nginx на VPS :80/:443
       ├─ xbuddha.org                  → 127.0.0.1:3000 → Next.js
       ├─ www.xbuddha.org              → 301 https://xbuddha.org
       └─ admin.xbuddha.org            → 127.0.0.1:8055 → Directus
                                                            └─ postgres:5432
```

`docker-compose.production.yml` управляет Next.js, Directus и PostgreSQL. Все контейнеры находятся в сети `x-buddha-production-internal`; Next.js и Directus опубликованы только на loopback хоста, а PostgreSQL не публикует порт вообще. Данные PostgreSQL и uploads Directus находятся в именованных Docker volumes и сохраняются после `docker compose down` и замены контейнеров. Удаляет их только явная команда с `--volumes`.

Nginx и Certbot работают на хосте. Так первичный HTTP challenge не зависит от наличия сертификатов внутри Docker, а системный timer Certbot выполняет автоматическое продление.

## Подготовленный VPS

Production-каталог: `/opt/x-buddha` на отдельном VPS `178.212.14.78`. На хосте установлены Docker Engine, Compose plugin, Nginx, Certbot и UFW; Next.js, Directus и PostgreSQL остаются контейнерными сервисами. Секретный `/opt/x-buddha/.env.production` имеет права `600`.

UFW разрешает входящие `22/tcp`, `80/tcp` и `443/tcp`. SSH принимает key-based access, password authentication отключена, root-доступ по ключу сохранён. Подключён постоянный swap `/swapfile` размером 2 GiB. Фактическое состояние подготовки зафиксировано в [отчёте задачи 013](docs/audits/013-vps-preparation-report.md).

На сервере активна HTTPS-конфигурация Nginx. Единый сертификат Let's Encrypt покрывает `xbuddha.org`, `www.xbuddha.org` и `admin.xbuddha.org`; renewal выполняет системный timer Certbot, а deploy hook проверяет и перезагружает Nginx после успешного обновления.

## DNS

До получения SSL создать у DNS-провайдера записи и дождаться их распространения:

```text
A      @       178.212.14.78
A      admin   178.212.14.78
CNAME  www     xbuddha.org
```

Задача 013 не изменяла DNS. Владелец подтвердил TTL 300 и указанные выше записи; при финальной проверке 11 августа 2026 года резолверы Cloudflare и Google возвращали те же значения. Если `www` не нужен, удалить его из DNS, команд Certbot, `CORS_ORIGIN` и Nginx-конфигурации одновременно.

## Базовая безопасность VPS

- вход по SSH-ключу; после проверки отдельной сессией отключить password authentication и password-based root login, сохранив root-доступ по ключу;
- актуальные OS packages, Docker Engine с Compose plugin, Nginx и Certbot;
- во firewall открыть только `22/tcp`, `80/tcp`, `443/tcp`; SSH лучше ограничить доверенными адресами;
- не открывать `3000`, `5432` и `8055`; убедиться, что cloud firewall Hostinger также не разрешает их;
- использовать независимые случайные `DIRECTUS_KEY`, `DIRECTUS_SECRET`, пароль БД и пароль администратора;
- хранить `.env.production` только на VPS с правами `600`, никогда не добавлять его в Git;
- оставить public policy Directus без app/admin access и только с минимальными правами из `scripts/configure-directus-access.mjs`.

Пример UFW после проверки рабочего SSH-доступа:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

## Environment

Создать production-файл из шаблона:

```bash
cp .env.production.example .env.production
chmod 600 .env.production
openssl rand -hex 32
```

Повторить генерацию для независимых `DIRECTUS_KEY` и `DIRECTUS_SECRET`, задать отдельные сильные пароли Directus и PostgreSQL. Значения `NEXT_PUBLIC_*` встраиваются при Docker build, поэтому их изменение требует повторной сборки frontend image.

- `SITE_URL` — публичный canonical origin сайта;
- `DIRECTUS_URL` — публичный HTTPS origin API и файлов, используемый в браузерных URL;
- `DIRECTUS_INTERNAL_URL` — адрес API внутри Docker network для серверных запросов Next.js;
- `NEXT_PUBLIC_ADMIN_URL` — публичная ссылка Directus Studio в footer;
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — production ID счётчика `111463994`; frontend загружает Метрику только после согласия пользователя.

В интерфейсе счётчика `111463994` вручную создать две цели типа «Целевое событие». Для каждой выбрать условие «совпадает» и указать идентификатор `messenger_telegram_click` либо `messenger_max_click`. Frontend уже вызывает `reachGoal` с этими идентификаторами во всех основных CTA и передаёт параметр `location`.

`DIRECTUS_URL` и `NEXT_PUBLIC_ADMIN_URL` в production должны оставаться `https://admin.xbuddha.org`; `directus:8055` допустим только в `DIRECTUS_INTERNAL_URL`.

## Первый deployment

Установить Docker Engine/Compose, Nginx и Certbot из поддерживаемых репозиториев ОС или Docker, клонировать репозиторий в постоянный каталог и подготовить `.env.production`. До подключения к VPS выполнить обязательные проверки в рабочем окружении с Node.js:

```bash
npm ci
npm run lint
npm run build
```

Затем из корня проекта на VPS:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
docker compose --env-file .env.production -f docker-compose.production.yml build
docker compose --env-file .env.production -f docker-compose.production.yml up -d
docker compose --env-file .env.production -f docker-compose.production.yml ps
```

На подготовленном VPS системные компоненты, репозиторий и env уже созданы. Node.js на production-хосте не требуется: `npm ci` и production build выполняются внутри multi-stage Dockerfile. DNS и SSL включаются только после localhost smoke-check стека.

Runtime frontend не содержит dev dependencies: Dockerfile копирует в финальный image только standalone Next.js output. Скрипт public access Directus запускается внутри CMS-контейнера.

### Первый SSL-сертификат

После настройки DNS сначала включить HTTP-only конфигурацию:

```bash
sudo install -d -m 755 /var/www/certbot
sudo cp nginx/x-buddha.bootstrap.conf /etc/nginx/sites-available/x-buddha
sudo ln -sfn /etc/nginx/sites-available/x-buddha /etc/nginx/sites-enabled/x-buddha
sudo nginx -t
sudo systemctl reload nginx
```

Получить один Let’s Encrypt certificate для трёх имён, подставив реальный email:

```bash
sudo certbot certonly --webroot -w /var/www/certbot \
  -d xbuddha.org -d www.xbuddha.org -d admin.xbuddha.org \
  --email <ADMIN_EMAIL> --agree-tos --no-eff-email
```

После успешного выпуска включить HTTPS reverse proxy:

```bash
sudo install -m 644 \
  /usr/lib/python3/dist-packages/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
  /etc/letsencrypt/options-ssl-nginx.conf
sudo install -m 644 \
  /usr/lib/python3/dist-packages/certbot/ssl-dhparams.pem \
  /etc/letsencrypt/ssl-dhparams.pem
sudo cp nginx/x-buddha.conf /etc/nginx/sites-available/x-buddha
sudo nginx -t
sudo systemctl reload nginx
sudo cp scripts/reload-nginx-after-certbot.sh /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
sudo chmod 755 /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
sudo systemctl enable --now certbot.timer
sudo certbot renew --dry-run
```

Пути к TLS-шаблонам выше соответствуют пакетам Certbot Ubuntu 26.04. Если пакетная структура изменится, сначала найти файлы через `dpkg -L python3-certbot-nginx` и `dpkg -L python3-certbot`; не выполнять reload, пока `nginx -t` не завершится успешно.

Конфигурация перенаправляет HTTP на HTTPS, `www` на основной домен, передаёт Host/real IP/forwarded headers и Upgrade для WebSocket. Gzip включён; Brotli можно включить только при наличии поддерживаемого Nginx-модуля.

### Directus schema, public access и первый admin

Дождаться healthy-состояния Directus и применить версионируемый snapshot, не создавая коллекцию вручную:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml exec -T directus \
  npx directus schema apply --yes /directus/snapshots/articles.yaml
docker compose --env-file .env.production -f docker-compose.production.yml exec -T directus \
  node /directus/project-scripts/configure-directus-access.mjs
```

На пустой БД Directus создаёт первого администратора из `DIRECTUS_ADMIN_EMAIL` и `DIRECTUS_ADMIN_PASSWORD`. Эти значения должны быть production-уникальными и не должны попадать в Git или логи. После первого входа в `https://admin.xbuddha.org` сменить временный пароль, обновить секретный env-файл текущими credentials, проверить роль редактора и убедиться, что public policy не имеет доступа к Studio или draft-записям.

Подробный редакторский процесс остаётся в `docs/cms/directus.md`.

## Обычное обновление

Перед изменением схемы или критическим обновлением обязательно сделать backup. Затем:

```bash
git pull --ff-only origin main
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
docker compose --env-file .env.production -f docker-compose.production.yml build
docker compose --env-file .env.production -f docker-compose.production.yml up -d --remove-orphans
docker compose --env-file .env.production -f docker-compose.production.yml ps
```

`npm run lint` и `npm run build` должны быть успешно выполнены в рабочем окружении до `git push`; production Docker build повторно проверяет TypeScript и Next.js build.

Если snapshot Directus изменился, после backup применить его отдельной командой из предыдущего раздела. `docker compose down` без `--volumes` безопасен для persistent data, но для обычного обновления не требуется.

## Healthchecks и smoke test

Compose ждёт healthy PostgreSQL перед Directus и healthy Directus перед Next.js. Локальные проверки на VPS:

```bash
curl --fail http://127.0.0.1:3000/api/health/
curl --fail http://127.0.0.1:8055/server/health
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml port postgres 5432
sudo ss -lntp | grep -E ':(3000|5432|8055)\b'
```

Команда `port postgres 5432` не должна возвращать опубликованный адрес; `3000` и `8055` должны слушать только `127.0.0.1`. После SSL проверить извне:

```bash
curl --fail --silent --show-error https://xbuddha.org/api/health/
curl --fail --silent --show-error https://admin.xbuddha.org/server/health
curl --head https://www.xbuddha.org
```

В браузере проверить главную, `/blog`, опубликованную статью, `/privacy`, штатный 404 на `/offer`, загрузку Directus image, вход в Studio и CTA Telegram/MAX на desktop/mobile; ссылки на `/offer` в интерфейсе быть не должно. Для consent проверить нового пользователя, принятие и отказ, сохранение выбора после reload и отсутствие запросов Метрики до согласия. После согласия проверить загрузку счётчика `111463994`, отсутствие повторной инициализации и отправку `messenger_telegram_click`/`messenger_max_click`. Проверка persistence в окно обслуживания: записать тестовую draft-статью и файл, выполнить `docker compose ... down`, затем `docker compose ... up -d` без `--volumes` и убедиться, что оба объекта сохранены; после проверки удалить только тестовые объекты через Studio.

## Логи и управление сервисами

Docker logs ограничены тремя файлами по 10 MB на сервис:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=200
docker compose --env-file .env.production -f docker-compose.production.yml logs -f frontend directus postgres
docker compose --env-file .env.production -f docker-compose.production.yml restart frontend
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

`restart: unless-stopped` поднимает сервисы после reboot, если их явно не остановили. Для Nginx используются `journalctl -u nginx` и `/var/log/nginx/`.

## Backup

Хранить backups вне контейнеров в `/srv/backups/x-buddha`, права каталога `700`. Минимальная рекомендуемая частота: nightly PostgreSQL и uploads, перед каждой миграцией/обновлением схемы; хранить минимум 14 дневных копий и регулярно переносить зашифрованную копию на другой сервер или object storage. Backup только на том же VPS не защищает от потери VPS.

Создание согласованной пары архивов:

```bash
sudo install -d -m 700 /srv/backups/x-buddha
backup_stamp=$(date -u +%Y%m%dT%H%M%SZ)
docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres \
  sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' \
  > "/srv/backups/x-buddha/postgres-${backup_stamp}.dump"
docker run --rm \
  -v x-buddha-production_directus_uploads:/source:ro \
  -v /srv/backups/x-buddha:/backup \
  alpine:3.22 tar -czf "/backup/directus-uploads-${backup_stamp}.tar.gz" -C /source .
```

Проверять ненулевой размер обоих файлов и периодически тестировать restore на отдельном окружении.

### Restore

Restore перезаписывает текущие БД и uploads. Сначала сделать свежий backup, остановить frontend/Directus и точно выбрать совместимую пару файлов:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml stop frontend directus
docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres \
  sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner' \
  < /srv/backups/x-buddha/postgres-<STAMP>.dump
docker run --rm \
  -v x-buddha-production_directus_uploads:/target \
  -v /srv/backups/x-buddha:/backup:ro \
  alpine:3.22 sh -c \
  'find /target -mindepth 1 -maxdepth 1 -exec rm -rf -- {} + && tar -xzf /backup/directus-uploads-<STAMP>.tar.gz -C /target'
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

После restore выполнить все healthchecks и smoke test. Не использовать `docker compose down --volumes` как способ восстановления.

## Rollback приложения

Минимальная единица rollback — известный исправный Git tag/commit плюс совместимый backup БД/uploads:

```bash
git switch --detach <KNOWN_GOOD_TAG_OR_COMMIT>
docker compose --env-file .env.production -f docker-compose.production.yml build frontend
docker compose --env-file .env.production -f docker-compose.production.yml up -d frontend
```

Если обновление меняло Directus schema или данные несовместимо, восстановить предварительный backup до запуска старой версии. После устранения инцидента вернуться на актуальную ветку только fast-forward-командами. Не переписывать опубликованную историю и не делать force push.

## Локальная проверка конфигурации

Перед commit и каждым deployment обязательны:

```bash
npm run lint
npm run build
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
docker build -t x-buddha-frontend:check .
```

Для локального integration test можно использовать временный `.env.production`, тестовые credentials и loopback-порты. Не направлять production DNS на локальное окружение и не получать production SSL в рамках такой проверки.

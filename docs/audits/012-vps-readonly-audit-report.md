# Отчёт по read-only аудиту production VPS

Дата среза: 10 августа 2026 года. Целевой VPS: `5.42.106.11` (Timeweb Cloud).

Аудит выполнен по задаче 012 через SSH с подготовленным ключом. На VPS выполнялись только команды чтения состояния ОС, процессов, сокетов, systemd, Nginx, сертификатов и firewall. Файлы и конфигурация не изменялись, пакеты не устанавливались, сервисы и контейнеры не запускались и не перезапускались. Содержимое `.env`, приватные ключи и credentials не читалось.

## Текущее состояние VPS

- ОС: Ubuntu 22.04.5 LTS, kernel `5.15.0-185-generic`, архитектура `x86_64`, виртуализация KVM.
- Ресурсы: 2 vCPU, 1.9 GiB RAM, swap отсутствует.
- На момент аудита использовалось 612 MiB RAM, доступно 1.1 GiB; load average — `0.04 / 0.01 / 0.00`.
- Uptime — 31 день 12 часов.
- Корневой диск: 39 GiB, занято 11 GiB, свободно 28 GiB (28% занято).
- System journal занимает 3.8 GiB из 4.1 GiB в `/var/log`.
- Docker и Docker Compose не установлены. Docker containers, networks и volumes отсутствуют.
- Активны Nginx, OpenSSH, PM2 и Zabbix Agent.

### Сетевые сервисы

| Порт | Bind/process | Доступ снаружи | Назначение |
| --- | --- | --- | --- |
| 22/tcp | `0.0.0.0`, `[::]` / OpenSSH | да | SSH |
| 80/tcp | `0.0.0.0` / Nginx | да | HTTP redirect |
| 443/tcp | `0.0.0.0` / Nginx | да | HTTPS reverse proxy |
| 3000/tcp | `*` / Next.js | да | LikeGallery напрямую, в обход Nginx |
| 10050/tcp | `0.0.0.0` / Zabbix Agent | да | мониторинг |
| 5432/tcp | не слушает | нет | свободен для PostgreSQL без публикации |
| 8055/tcp | не слушает | нет | свободен для loopback-публикации Directus |

Публичная доступность проверена отдельным TCP-подключением с машины аудита. Состояние cloud firewall из SSH определить нельзя; фактическая доступность показывает, что как минимум порты `22`, `80`, `443`, `3000` и `10050` пропускаются до VPS.

## Reverse proxy и SSL

- Используется host-level Nginx `1.18.0`.
- Активен один site symlink: `/etc/nginx/sites-enabled/default` → `/etc/nginx/sites-available/default`.
- Единственный настроенный virtual host обслуживает `likegallery.ru`, `www.likegallery.ru` и IP VPS.
- HTTP перенаправляется на `https://$host$request_uri`; HTTPS проксируется на `http://localhost:3000`.
- Неизвестный HTTP Host сейчас попадает в default server. Поэтому запрос с Host `xbuddha.org` на этот VPS получает redirect на `https://xbuddha.org`, хотя отдельного X-Buddha server block ещё нет.
- SSL выпущен Let’s Encrypt только для `likegallery.ru` и `www.likegallery.ru`; сертификат действителен с 19 июля по 17 октября 2026 года.
- Certbot установлен, renewal настроен через активный `certbot.timer` дважды в сутки. Текущий сертификат использует Nginx authenticator/installer.
- X-Buddha virtual hosts и сертификаты отсутствуют.

## Существующие production-сервисы

### LikeGallery

LikeGallery фактически находится на этом VPS:

- каталог приложения: `/root/likegallery.ru`;
- Next.js `15.5.12`, Sanity `4.22.0`;
- запуск: `npm start` под PM2, PM2 восстанавливается unit-файлом `pm2-root.service` после reboot;
- рабочий Next.js процесс занимает около 405 MiB RSS;
- каталог проекта занимает около 1.9 GiB;
- локальный запрос к `127.0.0.1:3000` возвращает HTTP 200;
- production env-файл существует, но его содержимое в ходе аудита не читалось.

Критично не затронуть каталог `/root/likegallery.ru`, unit `pm2-root.service`, PM2 state, порт `3000`, действующий Nginx default site и сертификат `likegallery.ru`.

### Другие сервисы

Других production-приложений, БД или контейнеров в стандартных каталогах и списке процессов не найдено. Zabbix Agent является действующим инфраструктурным сервисом; его необходимость и допустимые источники подключения нужно уточнить до изменения firewall.

## Firewall и безопасность

- UFW установлен, но неактивен; активных nftables-правил не обнаружено.
- SSH слушает IPv4 и IPv6 на порту 22.
- Эффективная SSH-конфигурация разрешает `PermitRootLogin yes` и `PasswordAuthentication yes`; доступ по ключу также разрешён и проверен.
- Публичные `3000/tcp` и `10050/tcp` увеличивают поверхность атаки. Закрытие или ограничение этих портов требует отдельной согласованной задачи, поскольку может повлиять на LikeGallery и мониторинг.

## Ресурсы

2 vCPU достаточно для начальной малой нагрузки двух Next.js-приложений, Directus и PostgreSQL. 28 GiB свободного диска достаточно для первого размещения, если ограничить рост system journal, Docker logs и настроить внешние backups.

Текущие 1.9 GiB RAM без swap не дают безопасного production-запаса для LikeGallery, X-Buddha, Directus и PostgreSQL, особенно при Docker build, миграциях и кратковременных пиках. Развёртывание полного стека на текущем объёме памяти не рекомендуется. До deployment следует выбрать одно из решений:

1. увеличить VPS минимум до 4 GiB RAM и настроить контролируемый swap;
2. разместить X-Buddha на отдельном VPS с сопоставимым или большим объёмом памяти.

Первый вариант сохраняет согласованную схему одного VPS, но требует отдельного окна работ и проверки LikeGallery после изменения тарифа/reboot.

## Совместимость и конфликты

Сопоставление выполнено с `docker-compose.production.yml`, `Dockerfile`, `nginx/x-buddha.conf` и `DEPLOY.md`.

| Область | Фактическое состояние | Вывод |
| --- | --- | --- |
| Frontend port | LikeGallery занимает и публично публикует `3000` | прямой конфликт с `127.0.0.1:3000:3000` X-Buddha |
| Directus port | `8055` свободен | конфликта нет; оставить bind только на `127.0.0.1` |
| PostgreSQL port | `5432` свободен | конфликта нет; не публиковать на host |
| Docker | не установлен | до deployment нужны Docker Engine и Compose plugin |
| Container names | контейнеров нет; Compose не задаёт фиксированные `container_name` | фактического конфликта нет |
| Docker network | Docker networks отсутствуют | имя `x-buddha-production-internal` свободно |
| Docker volumes | Docker volumes отсутствуют | Compose volumes свободны |
| Nginx | host Nginx уже занимает 80/443 и обслуживает LikeGallery | сохранить общий host Nginx, добавить отдельный site, не заменять `default` |
| SSL | Certbot и renewal уже работают для LikeGallery | выпустить отдельный сертификат X-Buddha, не менять существующий renewal config |
| Домены | задача задаёт `.org`, а production-файлы проекта — `.ru` | обязательная синхронизация конфигурации до deployment |
| DNS | `xbuddha.org` и `www.xbuddha.org` указывают на `2.57.91.91`; `admin.xbuddha.org` отсутствует | DNS ещё не направлен на целевой VPS |
| RAM | 1.9 GiB, swap отсутствует, 1.1 GiB доступно | недостаточный безопасный запас для полного стека |
| Disk | 28 GiB свободно, journal 3.8 GiB | достаточно на старте при настройке retention и backups |

Основное доменное расхождение затрагивает `DEPLOY.md`, `docker-compose.production.yml`, `Dockerfile`, `.env.production.example`, обе Nginx-конфигурации и публичные URL в архитектурной документации. Исправлять его в рамках read-only аудита запрещено условиями задачи.

## Рекомендуемая архитектура X-Buddha

```text
Internet
  └─ cloud firewall + host firewall
       └─ host Nginx :80/:443
            ├─ likegallery.ru     → 127.0.0.1:3000 → существующий PM2/Next.js
            ├─ xbuddha.org        → 127.0.0.1:3001 → Docker Next.js :3000
            ├─ www.xbuddha.org    → 301 https://xbuddha.org
            └─ admin.xbuddha.org  → 127.0.0.1:8055 → Docker Directus :8055
                                                        └─ PostgreSQL :5432
                                                           только во внутренней Docker network
```

Такая схема не требует менять порт или процесс LikeGallery. Для X-Buddha достаточно изменить только host-side bind frontend на `127.0.0.1:3001:3000` и соответствующий `proxy_pass`; контейнерный порт Next.js остаётся `3000`. Directus сохраняет текущий запланированный loopback bind, PostgreSQL не публикуется.

## Изменения перед deployment

Следующая отдельная задача должна выполнить действия в таком порядке:

1. Синхронизировать production-конфигурацию проекта с утверждёнными доменами `xbuddha.org`, `www.xbuddha.org`, `admin.xbuddha.org`, включая canonical URL, Directus public/admin URL, CORS, Nginx и SSL-инструкции.
2. Изменить host bind frontend в Compose на `127.0.0.1:3001:3000`, а X-Buddha Nginx upstream — на `127.0.0.1:3001`.
3. Увеличить RAM минимум до 4 GiB и настроить swap либо подготовить отдельный VPS; после возможного reboot проверить LikeGallery, PM2, Nginx и Certbot.
4. Согласовать hardening: создать и проверить отдельного sudo-пользователя с SSH-ключом, затем отключить password/root login; открыть только необходимые публичные порты. Порт `10050` ограничивать только после согласования с владельцем мониторинга.
5. Настроить Timeweb cloud firewall и host firewall. Не открывать `3000`, `3001`, `5432`, `8055`; `22` по возможности ограничить доверенными IP.
6. Установить поддерживаемые Docker Engine и Compose plugin, учитывая влияние Docker на firewall rules.
7. Разместить X-Buddha в отдельном постоянном каталоге, создать секретный `.env.production` с правами `600`, выполнить локальные проверки конфигурации без чтения/вывода секретов.
8. Добавить X-Buddha отдельным Nginx site. Не перезаписывать `/etc/nginx/sites-available/default` и не менять LikeGallery certificate paths.
9. Настроить HTTP challenge, проверить `nginx -t`, затем отдельным контролируемым reload применить конфигурацию.
10. После готовности HTTP перевести DNS `xbuddha.org` с `2.57.91.91` на `5.42.106.11`, создать `admin` и `www`, дождаться распространения DNS и выпустить отдельный Let’s Encrypt certificate для трёх `.org`-имён.
11. Выполнить deployment Compose, применить Directus schema/public policy и провести health/smoke checks обоих проектов.
12. Настроить лимиты journal/Docker logs, PostgreSQL/uploads backup и внешнее хранение копий.

## Непроверенные области

- Настройки Timeweb cloud firewall недоступны через SSH; зафиксирована только наблюдаемая снаружи доступность портов.
- Docker runtime-конфигурация и Compose health status не проверялись, поскольку Docker отсутствует. Его установка запрещена read-only режимом.
- Фактические DNS-изменения, Nginx reload, Certbot issuance и deployment не выполнялись.
- Секретные env-файлы, PM2 dump, приватные SSL-ключи и credentials намеренно не читались.

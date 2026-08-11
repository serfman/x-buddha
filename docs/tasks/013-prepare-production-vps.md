# Задача 013. Подготовка отдельного production VPS для X-Buddha

## Цель

Подготовить новый отдельный VPS к production-развёртыванию X-Buddha.

Сервер:

- IP: `178.212.14.78`

- SSH user: `root`

- SSH port: `22`

Production-домены:

- основной сайт: `https://xbuddha.org`

- `https://www.xbuddha.org` → 301 redirect на `https://xbuddha.org`

- Directus: `https://admin.xbuddha.org`

На одном VPS должны в дальнейшем работать:

- Next.js;

- Directus;

- PostgreSQL;

- reverse proxy.

DNS пока не переключать и публичный production deployment в рамках задачи не выполнять.

---

## Перед началом изучить

Обязательно изучить:

- `client_tz.md`;

- `AGENTS.md`;

- `PROJECT_RULES.md`;

- `README.md`;

- `DEPLOY.md`;

- `docs/project-plan.md`;

- `docs/TODO.md`;

- `docs/architecture/*`;

- `docs/cms/directus.md`;

- `docs/audits/012-vps-readonly-audit-report.md`;

- `docker-compose.production.yml`;

- `Dockerfile`;

- `nginx/*`;

- `.env.production.example`;

- текущий файл задачи.

Учесть, что аудит 012 относился к старому VPS `5.42.106.11`.

X-Buddha теперь размещается на отдельном VPS `178.212.14.78`, поэтому ограничения совместного размещения с LikeGallery больше не применяются.

---

## 1. Первичный аудит нового VPS

После настройки SSH-доступа сначала провести короткий аудит:

- ОС и версия;

- CPU;

- RAM;

- swap;

- диск;

- listening ports;

- установленные Docker / Compose / Nginx;

- firewall;

- существующие сервисы.

Если обнаружены неожиданные production-сервисы или существенные расхождения с предположением о новом чистом VPS — остановить задачу и сообщить об этом до внесения изменений.

---

## 2. Актуализировать production-конфигурацию проекта

Исправить оставшиеся ссылки на старые production-домены `.ru`.

Целевая конфигурация:

`https://xbuddha.org`

`https://admin.xbuddha.org`

`www.xbuddha.org` должен перенаправляться 301 на `https://xbuddha.org`.

Проверить:

- SITE_URL;

- canonical;

- Open Graph;

- Directus URL;

- admin URL;

- CORS;

- Docker Compose;

- Nginx;

- `.env.production.example`;

- [DEPLOY.md](http://DEPLOY.md);

- архитектурную документацию.

Не оставлять production-зависимости от `.ru`.

---

## 3. Базовая подготовка VPS

Установить только необходимые production-компоненты.

Предпочтительная схема:

- Docker Engine;

- Docker Compose plugin;

- host-level Nginx;

- Certbot.

Не устанавливать Node.js/PostgreSQL/Directus непосредственно в ОС, если они работают через Docker.

---

## 4. Production architecture

Подготовить:

Internet

↓

Nginx

├── [xbuddha.org](http://xbuddha.org) → Next.js

├── [www.xbuddha.org](http://www.xbuddha.org) → 301 [xbuddha.org](http://xbuddha.org)

└── [admin.xbuddha.org](http://admin.xbuddha.org) → Directus

                         ↓

                     PostgreSQL

Next.js, Directus и PostgreSQL запускать через production Docker Compose.

PostgreSQL наружу не публиковать.

---

## 5. Ports

Публично должны требоваться только:

- 22 — SSH;

- 80 — HTTP;

- 443 — HTTPS.

Next.js и Directus должны быть доступны только локально через reverse proxy.

Допустимая схема:

- Next.js → `127.0.0.1:3000`;

- Directus → `127.0.0.1:8055`;

- PostgreSQL → только внутренняя Docker network.

Не публиковать PostgreSQL `5432` наружу.

---

## 6. Swap

Проверить фактический объём RAM VPS.

Для сервера с 2 GiB RAM настроить swap для защиты от кратковременных пиков памяти при сборках и работе сервисов.

Рекомендуемый размер:

`2 GiB`

Настроить постоянное подключение swap после reboot.

Не рассматривать swap как замену RAM.

---

## 7. Firewall

Настроить firewall.

Разрешить:

- SSH;

- HTTP;

- HTTPS.

Не открывать наружу:

- 3000;

- 8055;

- 5432.

Перед применением firewall обязательно убедиться, что SSH-доступ по ключу работает, чтобы не потерять доступ к VPS.

---

## 8. SSH hardening

После проверки отдельного SSH-ключа:

- сохранить работающий key-based access;

- проверить новый вход отдельной SSH-сессией;

- только после этого отключить password authentication;

- запретить password-based root login.

Не выполнять изменения, способные заблокировать доступ, пока вход по ключу не проверен.

Не удалять root-доступ по ключу в рамках этой задачи без необходимости.

---

## 9. Production directory

Создать отдельный постоянный каталог проекта.

Например:

`/opt/x-buddha`

или другой стандартный production path.

Не использовать случайные временные каталоги.

Клонировать официальный repository X-Buddha.

---

## 10. Environment

Создать production `.env` на VPS на основе `.env.production.example`.

Не коммитить его.

Права:

`600`

Реальные секреты:

- генерировать безопасным способом;

- не выводить в итоговый ответ;

- не помещать в Git;

- не записывать в документацию.

Если часть данных ещё отсутствует, оставить их как явные blockers.

В частности могут отсутствовать:

- Yandex Metrika ID;

- RuTube URL;

- юридические данные.

---

## 11. Docker

Проверить production Compose непосредственно на VPS.

Проверить:

- конфигурацию;

- networks;

- volumes;

- healthchecks;

- restart policies;

- отсутствие публичного PostgreSQL;

- persistent Directus uploads;

- persistent PostgreSQL data.

На этом этапе допускается технический запуск стека для проверки по localhost/IP, если он не делает сайт публично доступным через production-домены.

---

## 12. Directus

Подготовить production Directus.

Проверить:

- PostgreSQL connection;

- persistent uploads;

- schema snapshot;

- public permissions;

- admin authentication;

- production URL `https://admin.xbuddha.org`.

Создать администратора безопасным способом.

Credentials не выводить в отчёте и не коммитить.

---

## 13. Nginx

Подготовить отдельные server blocks:

- `xbuddha.org`;

- `www.xbuddha.org`;

- `admin.xbuddha.org`.

До переключения DNS допускается подготовить конфигурацию, но не ломать Nginx из-за отсутствующих сертификатов.

Обязательно:

`nginx -t`

до reload.

---

## 14. SSL

Подготовить процедуру Let's Encrypt.

Фактический выпуск сертификатов выполнять только после того, как DNS соответствующих доменов указывает на новый VPS.

Если DNS ещё не переключён — SSL issuance оставить для следующей deployment-задачи.

---

## 15. DNS

В рамках задачи DNS в Hostinger НЕ изменять.

Зафиксировать необходимые записи:

A      @       178.212.14.78

A      admin   178.212.14.78

CNAME  www     [xbuddha.org](http://xbuddha.org)

Переключение выполнить отдельным контролируемым шагом после готовности сервера.

---

## 16. Backup

Подготовить существующий предусмотренный проектом механизм backup:

- PostgreSQL;

- Directus uploads.

Проверить команды backup/restore.

Не хранить единственную резервную копию внутри контейнера.

---

## 17. Проверки

Проверить:

- SSH key access;

- reboot-safe swap;

- Docker;

- Docker Compose;

- firewall;

- production Compose;

- Next.js;

- Directus;

- PostgreSQL;

- healthchecks;

- persistent volumes;

- Nginx config;

- отсутствие наружу портов 3000/8055/5432;

- restart policies.

Также выполнить проектные проверки:

`npm run lint`

`npm run build`

---

## 18. Что не делать

В рамках задачи не:

- переключать DNS;

- публиковать сайт на `xbuddha.org`;

- выпускать SSL до готовности DNS;

- считать production deployment завершённым;

- закрывать финальные work items P7;

- запускать P6 QA как завершённый этап.

---

## 19. Документация

Обновить:

- `DEPLOY.md`;

- архитектурную документацию;

- `docs/project-plan.md`;

- `docs/TODO.md`;

- `CHANGELOG.md`.

Удалить из актуальных production-инструкций зависимость X-Buddha от старого VPS `5.42.106.11`.

Отчёт 012 сохранить как исторический аудит.

---

## Definition of Done

- новый VPS проверен;

- SSH key access работает;

- production-домены синхронизированы на `.org`;

- Docker и Compose готовы;

- Nginx готов;

- firewall настроен;

- swap настроен;

- production repository размещён;

- production env подготовлен;

- Next.js + Directus + PostgreSQL могут работать на новом VPS;

- Directus schema и permissions подготовлены;

- порты приложения не открыты наружу;

- backup-процедура готова;

- DNS ещё не переключён;

- production deployment ещё не объявлен завершённым;

- документация обновлена;

- commit и push выполнены;

- актуальный `ПРОГРЕСС X-BUDDHA` выведен.
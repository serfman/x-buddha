```md
# Задача 011. Подготовка production-инфраструктуры X-Buddha

## Цель

Подготовить production-инфраструктуру проекта X-Buddha для последующего безопасного развёртывания на одном VPS.

В рамках задачи необходимо подготовить:

- production Docker Compose;
- запуск Next.js, Directus и PostgreSQL на одном VPS;
- reverse proxy для `x-buddha.ru` и `admin.x-buddha.ru`;
- production environment-конфигурацию;
- SSL;
- persistent storage;
- healthchecks;
- backup-процедуры;
- документацию по первичному развёртыванию и обновлениям.

Реальный production deployment в рамках этой задачи не выполнять.

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
- `docs/tasks/011-production-infrastructure.md`;
- существующие Docker / Compose / env-файлы проекта.

Не создавать параллельную инфраструктуру, если часть уже реализована.

Существующие корректные решения переиспользовать и доработать.

---

# 1. Целевая production-архитектура

Развернуть все основные сервисы на одном VPS.

Целевая схема:

```text
Internet
   ↓
Nginx
   ├── x-buddha.ru
   │      ↓
   │   Next.js
   │
   └── admin.x-buddha.ru
          ↓
       Directus
          ↓
      PostgreSQL
```

PostgreSQL не должен быть доступен из интернета.

---

# **2. Контейнеры**

Подготовить production Docker Compose минимум для:

- Next.js;
- Directus;
- PostgreSQL.

При необходимости Nginx также может работать в Docker.

Предпочтение — единый управляемый `docker compose`, если это не усложняет сопровождение.

Не добавлять дополнительные сервисы без необходимости.

---

# **3. Next.js**

Подготовить production-сборку приложения.

Требования:

- production mode;
- минимальный Docker image;
- multi-stage build;
- без dev dependencies в runtime;
- restart policy;
- healthcheck;
- необходимые environment variables.

Не хранить секреты внутри image.

---

# **4. Directus**

Использовать существующую конфигурацию Directus.

Production URL:

`https://admin.x-buddha.ru`

Directus должен использовать:

- PostgreSQL;
- persistent uploads;
- production secrets из environment;
- штатную систему авторизации Directus.

Не создавать отдельную админку.

---

# **5. PostgreSQL**

Использовать отдельный контейнер PostgreSQL.

Требования:

- persistent volume;
- отдельные database/user/password через environment;
- порт PostgreSQL не публиковать наружу;
- соединение только через внутреннюю Docker network;
- healthcheck.

Не использовать default credentials.

---

# **6. Docker network**

Создать внутреннюю сеть приложения.

Пример:

```text
frontend
directus
postgres
```

Все сервисы взаимодействуют внутри Docker network по именам контейнеров.

Не использовать публичный IP VPS для внутреннего подключения Directus → PostgreSQL.

---

# **7. Persistent storage**

Обязательно обеспечить persistent volumes для:

## **PostgreSQL**

- database data.

## **Directus**

- uploads;
- extensions, если они реально используются.

Данные не должны удаляться при:

`docker compose down`

или обновлении контейнера.

---

# **8. Reverse proxy**

Настроить Nginx.

## `x-buddha.ru`

Proxy:

`x-buddha.ru → Next.js`

Поддержать:

- HTTP/1.1;
- forwarded headers;
- gzip/brotli при доступности;
- корректный real IP;
- разумные timeout;
- WebSocket при необходимости.

## `admin.x-buddha.ru`

Proxy:

`admin.x-buddha.ru → Directus`

Поддержать:

- API;
- admin UI;
- uploads;
- WebSocket при необходимости;
- корректные forwarded headers.

---

# **9. HTTPS / SSL**

Подготовить SSL для:

- `x-buddha.ru`;
- `www.x-buddha.ru`, если используется;
- `admin.x-buddha.ru`.

Предпочтительный вариант:

Let’s Encrypt + Certbot

или другой простой поддерживаемый автоматический механизм.

Настроить:

- HTTP → HTTPS redirect;
- автоматическое обновление сертификатов.

Не использовать self-signed сертификаты в production.

---

# **10. DNS**

Зафиксировать в DEPLOY.md необходимые DNS записи.

Для Hostinger:

```text
A    @       <VPS_IP>
A    admin   <VPS_IP>
```

Если используется `www`:

```text
CNAME www x-buddha.ru
```

или эквивалентная корректная запись.

Не вписывать реальный IP в Git.

---

# **11. Environment variables**

Создать:

`.env.production.example`

или использовать существующую структуру env-документации.

Не хранить реальные секреты в Git.

Минимально предусмотреть:

## **Next.js**

```env
SITE_URL=https://x-buddha.ru
NEXT_PUBLIC_ADMIN_URL=https://admin.x-buddha.ru
NEXT_PUBLIC_YANDEX_METRIKA_ID=
DIRECTUS_URL=https://admin.x-buddha.ru
```

Использовать фактические имена переменных проекта, если они уже отличаются.

## **Directus**

Предусмотреть:

- `KEY`;
- `SECRET`;
- admin bootstrap credentials;
- DB host;
- DB port;
- DB database;
- DB user;
- DB password;
- public URL.

## **PostgreSQL**

- DB name;
- user;
- password.

Не дублировать одну и ту же переменную без необходимости.

---

# **12. Directus URL**

Убедиться, что production Directus URL:

`https://admin.x-buddha.ru`

используется во всех production-настройках.

Не использовать:

- localhost;
- internal Docker hostname;

в публичных ссылках браузера.

При этом серверный Next.js при необходимости может обращаться к Directus через внутренний Docker URL, если это архитектурно целесообразно.

Разделить:

- public Directus URL;
- internal Directus URL;

только если это действительно нужно.

---

# **13. Healthchecks**

Добавить healthchecks:

- PostgreSQL;
- Directus;
- Next.js.

Compose должен корректно учитывать зависимости сервисов.

Не полагаться только на порядок запуска контейнеров.

---

# **14. Restart policy**

Для production-сервисов настроить автоматический restart.

Например:

`unless-stopped`

или другой обоснованный режим.

После reboot VPS приложение должно подниматься автоматически.

---

# **15. Логи**

Логи должны быть доступны через:

`docker compose logs`

Не добавлять сложную внешнюю observability-инфраструктуру на этом этапе.

Предусмотреть ограничение размера Docker logs, чтобы они не заполнили диск VPS.

---

# **16. Backup**

Подготовить простой и документированный backup-процесс.

Минимум:

## **PostgreSQL**

Регулярный:

`pg_dump`

## **Directus**

Backup папки uploads.

Определить:

- что сохраняется;
- команду backup;
- команду restore;
- рекомендуемую частоту;
- место хранения backup.

Backup не должен храниться только внутри контейнера.

Не внедрять сложную backup SaaS-интеграцию без необходимости.

---

# **17. Firewall**

В документации зафиксировать рекомендуемые открытые порты VPS:

- 22 SSH;
- 80 HTTP;
- 443 HTTPS.

Не открывать наружу:

- PostgreSQL;
- Directus internal port;
- Next.js internal port.

---

# **18. Security baseline**

Зафиксировать минимальные production-требования:

- SSH key authentication;
- отключение password login при возможности;
- актуальные Docker/OS packages;
- сильные Directus admin credentials;
- уникальные production secrets;
- database credentials отдельно от admin;
- секреты вне Git;
- минимальные публичные permissions Directus.

Не внедрять сложные security-системы, не требуемые проектом.

---

# **19. Deployment flow**

Подготовить простой production workflow.

Рекомендуемый сценарий:

```text
git pull
↓
docker compose build
↓
docker compose up -d
↓
healthcheck
↓
smoke test
```

Или более подходящий существующей архитектуре проекта вариант.

Задокументировать:

- первый deploy;
- обычное обновление;
- rollback;
- просмотр логов;
- restart сервиса.

---

# **20. Rollback**

Предусмотреть минимальный rollback.

Например:

- предыдущий Git commit/tag;
- предыдущий Docker image;
- backup БД перед критической миграцией.

Не создавать сложный CI/CD pipeline только ради rollback.

---

# **21. Directus schema**

Учесть существующий snapshot/schema Directus.

В документации описать порядок применения схемы на новом production instance.

Не допускать ручного воссоздания структуры CMS без необходимости.

---

# **22. Первый production admin**

Описать создание первого администратора Directus.

Credentials не хранить в репозитории.

После первоначального запуска:

- сменить bootstrap credentials при необходимости;
- использовать штатную авторизацию Directus.

---

# **23. Публикация сайта**

В рамках этой задачи:

НЕ:

- менять DNS;
- запускать production;
- получать SSL на реальном сервере;
- публиковать сайт;
- переключать production domain.

Только подготовить инфраструктуру и документацию.

---

# **24. Project Plan**

После выполнения обновить P7.

Можно закрыть по факту:

- подготовить production-конфигурацию.

Остальные пункты P7 не закрывать до реального production deployment.

Если production environment описан, но не настроен на VPS — не отмечать «Настроить production environment» выполненным.

Не изменять проценты вручную.

---

# **25. Документация**

Обновить:

- `DEPLOY.md`;
- `docs/architecture/*`;
- `docs/project-plan.md`;
- `docs/TODO.md`;
- `CHANGELOG.md`.

В DEPLOY.md зафиксировать:

- архитектуру;
- DNS;
- Docker;
- Nginx;
- SSL;
- env;
- backup;
- deployment flow;
- rollback;
- smoke test.

Не дублировать те же инструкции в нескольких файлах.

---

# **26. Проверки**

Локально проверить:

- валидность Docker Compose;
- production build Next.js;
- запуск PostgreSQL;
- запуск Directus;
- соединение Directus → PostgreSQL;
- запуск Next.js;
- healthchecks;
- persistent volumes;
- отсутствие опубликованного PostgreSQL-порта.

Если возможно локально — проверить proxy-конфигурацию без изменения production DNS.

Выполнить:

`npm run lint`

`npm run build`

а также валидатор Docker Compose.

---

# **27. Завершение**

После выполнения:

1. обновить документацию;
2. обновить project plan;
3. обновить TODO;
4. обновить CHANGELOG;
5. создать commit;
6. выполнить push в `origin/main`;
7. вывести актуальный `ПРОГРЕСС X-BUDDHA`.

---

# **Definition of Done**

- production Docker Compose подготовлен;
- Next.js контейнеризирован;
- Directus использует PostgreSQL;
- PostgreSQL закрыт от внешнего доступа;
- persistent volumes настроены;
- Nginx-конфигурация подготовлена;
- `x-buddha.ru` направляется на Next.js;
- `admin.x-buddha.ru` направляется на Directus;
- SSL-процедура описана;
- env template подготовлен;
- healthchecks присутствуют;
- restart policy настроен;
- backup/restore описаны;
- firewall требования описаны;
- deployment и rollback описаны;
- Directus schema deployment описан;
- реальный production deployment не выполнен;
- lint/build проходят;
- commit и push выполнены.


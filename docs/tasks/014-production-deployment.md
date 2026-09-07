```md
# 014 — Production deployment X-Buddha

## Цель

Выполнить первый технический production deployment X-Buddha на подготовленном VPS и опубликовать:

- `https://xbuddha.org` — основной сайт;
- `https://www.xbuddha.org` → 301 на `https://xbuddha.org`;
- `https://admin.xbuddha.org` — Directus.

Настроить HTTPS и провести production smoke test.

Это технический запуск, а не финальная сдача проекта клиенту.

---

## Перед началом изучить

Обязательно изучить актуальное состояние проекта:

- `client_tz.md`;
- `AGENTS.md`;
- `PROJECT_RULES.md`;
- `README.md`;
- `DEPLOY.md`;
- `docs/project-plan.md`;
- `docs/TODO.md`;
- `docs/architecture/*`;
- `docs/cms/directus.md`;
- `docs/audits/013-vps-preparation-report.md`;
- `docker-compose.production.yml`;
- `Dockerfile`;
- `nginx/*`;
- `.env.production.example`;
- текущий файл задачи.

Перед любыми действиями сверить документацию с фактическим состоянием VPS.

Production VPS:

- IP: `178.212.14.78`;
- SSH user: `root`;
- SSH port: `22`.

Использовать уже настроенный SSH-доступ по ключу.

---

# 1. Предварительная проверка

Перед публикацией проверить:

- `xbuddha.org` резолвится в `178.212.14.78`;
- `admin.xbuddha.org` резолвится в `178.212.14.78`;
- `www.xbuddha.org` корректно резолвится;
- Next.js healthy;
- Directus healthy;
- PostgreSQL healthy;
- production env существует;
- Nginx работает;
- UFW работает;
- свободного места и RAM достаточно;
- swap активен.

Если обнаружен критический blocker — остановить deployment и сообщить о нём.

Не продолжать через критическую ошибку автоматически.

---

# 2. Зафиксировать состояние перед deployment

Перед изменением production:

- зафиксировать текущий Git commit;
- проверить состояние контейнеров;
- убедиться в наличии актуального backup PostgreSQL;
- убедиться в наличии backup Directus uploads;
- определить понятную rollback point.

Не удалять существующие backup.

---

# 3. Production configuration

Проверить production environment.

Основные production URL:

```env
SITE_URL=https://xbuddha.org
NEXT_PUBLIC_ADMIN_URL=https://admin.xbuddha.org
DIRECTUS_URL=https://admin.xbuddha.org
```

Использовать фактические имена переменных проекта.

Проверить отсутствие production-ссылок на старые `.ru` домены.

Секреты:

- не выводить;
- не добавлять в Git;
- не записывать в отчёт.

---

# **4. Nginx**

Активировать production-конфигурацию вместо bootstrap 404.

Маршрутизация:

```text
xbuddha.org
    ↓
Next.js

www.xbuddha.org
    ↓
301
    ↓
https://xbuddha.org

admin.xbuddha.org
    ↓
Directus
```

Перед каждым reload:

```bash
nginx -t
```

Reload выполнять только после успешной проверки конфигурации.

---

# **5. SSL**

Получить Let’s Encrypt сертификаты для:

- `xbuddha.org`;
- `www.xbuddha.org`;
- `admin.xbuddha.org`.

Настроить:

- HTTPS;
- HTTP → HTTPS;
- `www` → canonical `https://xbuddha.org`;
- автоматическое renewal сертификатов.

Проверить:

```bash
certbot renew --dry-run
```

или эквивалентную безопасную проверку существующей конфигурации.

---

# **6. Публикация основного сайта**

После успешной настройки Nginx и SSL открыть:

`https://xbuddha.org`

Проверить отсутствие:

- 502;
- 504;
- redirect loop;
- mixed content;
- runtime errors;
- проблем загрузки статических ресурсов.

---

# **7. Directus**

Открыть:

`https://admin.xbuddha.org`

Проверить:

- HTTPS;
- страницу авторизации;
- вход администратора;
- загрузку admin UI;
- API;
- подключение PostgreSQL;
- существующую schema;
- public permissions;
- работу uploads.

Credentials в отчёте не выводить.

---

# **8. Интеграция сайта с Directus**

Проверить production-цепочку:

```text
Browser
↓
xbuddha.org
↓
Next.js
↓
Directus
↓
PostgreSQL
```

Проверить:

- `/blog`;
- опубликованную статью, если она уже существует;
- получение контента из production Directus;
- корректную обработку отсутствующего материала;
- изображения Directus.

Если production Directus пока не содержит тестовой статьи, не считать это ошибкой инфраструктуры.

---

# **9. Persistence test**

Проверить сохранность данных.

Выполнить контролируемый restart контейнеров штатным способом.

После restart убедиться:

- PostgreSQL healthy;
- Directus healthy;
- Next.js healthy;
- Directus schema сохранилась;
- admin user сохранился;
- uploads сохранились;
- приложение снова доступно.

Не удалять volumes.

---

# **10. Production smoke test**

Проверить основной сайт на production.

Минимум:

- `/`;
- `/blog`;
- существующую `/blog/[slug]`, если есть опубликованная статья;
- `sitemap.xml`;
- `robots.txt`;
- favicon;
- Open Graph metadata;
- canonical;
- admin link;
- Telegram;
- MAX.

Проверить основные CTA.

RuTube-заглушку считать известным временным состоянием, если реальный URL ещё не предоставлен.

---

# **11. Mobile / desktop**

Проверить production минимум на:

- 360 px;
- 390 px;
- 768 px;
- 1024 px;
- 1440 px.

Проверить:

- отсутствие horizontal overflow;
- header;
- mobile navigation;
- CTA;
- блок атрибуции;
- изображения;
- финальный блок;
- footer;
- admin gear;
- Telegram/MAX.

Не выполнять полноценный P6 QA в рамках этой задачи — только production smoke test.

---

# **12. SEO production checks**

Проверить непосредственно на production:

- canonical → `https://xbuddha.org`;
- sitemap использует `.org`;
- robots использует production URL;
- Open Graph использует production URL;
- Twitter Card;
- JSON-LD;
- отсутствие ссылок на старый `.ru`.

Проверить redirect:

```text
http://xbuddha.org
→ https://xbuddha.org

http://www.xbuddha.org
→ https://xbuddha.org

https://www.xbuddha.org
→ https://xbuddha.org
```

Не должно быть redirect chains длиннее необходимого.

---

# **13. Security checks**

После публикации убедиться, что извне доступны только необходимые публичные сервисы.

Проверить:

- 22;
- 80;
- 

1. 443.

Не должны быть публично доступны:

- 3000;
- 8055;
- 

1. 5432.

Проверить UFW.

Убедиться, что SSH password authentication остаётся отключённой.

Не менять SSH-конфигурацию без необходимости.

---

# **14. Health после deployment**

Проверить:

- Docker containers;
- healthchecks;
- restart policies;
- RAM;
- swap;
- disk;
- Nginx logs;
- application logs.

Не должно быть непрерывного restart loop.

---

# **15. Rollback**

Если deployment вызывает критическую проблему:

1. не пытаться бесконечно исправлять production;
2. определить причину;
3. выполнить предусмотренный `DEPLOY.md` rollback;
4. восстановить последнюю рабочую конфигурацию;
5. проверить health;
6. описать blocker.

Не выполнять destructive database rollback без необходимости.

---

# **16. Что НЕ закрывать**

Техническая публикация не означает завершение всего проекта.

Не закрывать автоматически незавершённые work items:

## **P2**

Если отсутствуют:

- финальный RuTube;
- оставшиеся production media/content items.

## **P5**

Если отсутствуют:

- реальный ID Яндекс.Метрики;
- юридические данные/документы;
- связанные с ними проверки.

## **P6**

Не отмечать финальный QA выполненным.

## **P7**

Закрывать только те work items, которые фактически выполнены этой задачей.

Проценты рассчитывать по существующей формуле.

---

# **17. Документация**

После успешного deployment обновить:

- `DEPLOY.md`;
- `docs/project-plan.md`;
- `docs/TODO.md`;
- `CHANGELOG.md`.

При необходимости создать краткий production deployment report в:

`docs/audits/014-production-deployment-report.md`

Не записывать:

- пароли;
- токены;
- приватные ключи;
- `.env`;
- Directus credentials.

---

# **18. Git**

После изменений проекта:

- проверить diff;
- не включать несвязанные пользовательские изменения;
- создать commit;
- push в `origin/main`.

Изменения, существовавшие до начала задачи и не относящиеся к ней, сохранить без изменений.

---

# **Definition of Done**

Задача завершена, когда:

- `https://xbuddha.org` публично доступен;
- HTTPS работает;
- HTTP перенаправляется на HTTPS;
- `www` перенаправляется на `xbuddha.org`;
- `https://admin.xbuddha.org` доступен;
- Directus authentication работает;
- Next.js → Directus → PostgreSQL работает;
- контейнеры healthy;
- persistence после restart подтверждена;
- production smoke test пройден;
- canonical/OG/sitemap/robots используют `.org`;
- Telegram/MAX работают;
- закрытые application/database ports недоступны извне;
- SSL renewal проверен;
- rollback point существует;
- документация обновлена;
- commit/push выполнены;
- прогресс рассчитан по фактически закрытым work items.

В конце вывести:

ПРОГРЕСС X-BUDDHA  
P0 …  
P1 …  
…  
P7 …




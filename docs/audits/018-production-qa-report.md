# Отчёт Production QA & Optimization — задача 018

Дата аудита: 12 августа 2026 года. Проверенная версия до исправлений: `a5b792c`; production: `https://xbuddha.org`, Directus: `https://admin.xbuddha.org`.

## Результат

Проведён комплексный production QA по work items P6 из [плана проекта](../project-plan.md). Critical- и High-дефектов не обнаружено. Найденные Medium-дефекты исправлены и повторно проверены; реальное RuTube-видео подключено через отложенный embed без ранней загрузки player. Полная отдельная проверка Safari и Firefox остаётся ручной: доступное автоматизированное окружение использует Chromium.

## Проверенный объём

- Функциональные маршруты: `/`, `/blog/`, опубликованный `/blog/buddhist-sculpture-attribution/`, `/privacy/`, штатные 404 `/offer/`, неизвестного маршрута и неизвестного blog slug; `sitemap.xml`, `robots.txt`, health endpoints.
- Главная: header и навигация, hero slider, CTA Telegram/MAX, схема атрибуции, процесс оценки, видео, финальная композиция, footer, mobile menu и bottom sheet.
- Responsive: 360, 390, 768, 1024 и 1440 px; horizontal overflow не обнаружен. Проверены typography, spacing, изображения, CTA, attribution, video, blog, privacy, consent и footer.
- Blog/Directus: одна опубликованная статья проходит цепочку Directus → Next.js → `/blog`; проверены title, excerpt, rich content, cover, SEO description, Open Graph, sitemap и 404. Публичный запрос draft возвращает пустой список, системная коллекция Directus — 403. Недоступность CMS обрабатывается пользовательским сообщением без stack trace.
- SEO: canonical `.org`, metadata, Open Graph, Twitter Card, JSON-LD, H1/heading structure, indexability и `noindex` для 404. Старых `.ru` URL в production не обнаружено.
- Analytics/consent: production ID `111463994` встроен; до согласия скрипт Метрики отсутствует. Accept/Reject сохраняются после reload, основной сайт работает в обоих режимах. SPA `hit`, единичная инициализация и цели Telegram/MAX проверены по реализации; создание целей в интерфейсе Метрики остаётся внешней ручной настройкой.
- Security: HTTPS и сертификат, firewall, внешние порты, `.env` → 404, public Directus policy, CORS, SSH hardening, loopback bindings и отсутствие host port PostgreSQL.
- Infrastructure: три контейнера healthy, restart count 0, `unless-stopped`; доступно 2,2 GiB RAM, swap почти не используется, диск занят на 32%. Certbot timer active/enabled, сертификат действителен до 9 ноября 2026 года, backups PostgreSQL/uploads присутствуют. Restart loops, memory pressure, быстро растущие логи и актуальные критические ошибки не обнаружены.

## Lighthouse baseline

| Режим | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 92 | 100 | 100 | 100 | 1,3 с | 0 | 50 мс |
| Desktop | 96 | 100 | 100 | 100 | 0,5 с | 0 | 0 мс |

Лабораторный TBT использован как доступный аналог responsiveness/INP. Field INP не объявляется проверенным без достаточных CrUX-данных. Mobile Speed Index baseline — 7,6 с; главный UX/CWV-сигнал при этом стабилен: LCP 1,3 с и CLS 0.

После deployment повторный Lighthouse дал mobile 97/100/100/100 (LCP 1,1 с, CLS 0, TBT 30 мс) и desktop 96/100/100/100 (LCP 0,3 с, CLS 0, TBT 0 мс). Лабораторные значения между запусками могут колебаться; регрессий CWV и accessibility не обнаружено.

## Найденные и исправленные проблемы

| Severity | Проблема | Исправление и повторная проверка |
| --- | --- | --- |
| Medium | Переданный обычный RuTube URL нельзя открывать в iframe из-за `X-Frame-Options: SAMEORIGIN`. | URL остаётся централизованным в `site.ts`, компонент валидирует его и строит официальный `/play/embed/{id}/`; iframe создаётся только после клика, сохраняет 16:9 и не вызывает overflow/CLS. |
| Medium | SEO title опубликованной статьи получал суффикс `— X-Buddha` поверх уже заданного CMS title `| X-Buddha`. | Article metadata использует absolute title; production-ready build подтвердил единственный брендовый суффикс. |
| Medium | Часть messenger CTA имела accessible name, не содержащий видимый label; некоторые footer/CTA touch targets были ниже 44 px. | Убраны конфликтующие `aria-label`, пояснение перенесено в `title`, CTA и footer links получили `min-height: 44px`; видимый дизайн сохранён. |
| Medium | Production не отдавал базовые security headers и раскрывал application server headers. | В Next.js отключён `X-Powered-By`; Nginx скрывает upstream header, использует глобально отключённый version token и добавляет HSTS, nosniff, SAMEORIGIN для frontend, Referrer-Policy и Permissions-Policy. Конфигурация применяется только после `nginx -t`. |
| Medium | Lighthouse оценил около 45 KiB лишней передачи responsive images; Himalayas source весил 2,5 MiB. | Добавлен mobile breakpoint 384 px для Next/Image. Himalayas перекодирован с 2500×1667/2,5 MiB до 2000×1333/0,91 MiB без изменения aspect ratio и заметной потери для фактического затемнённого фона. |
| Medium | Проект декларировал Manrope, но не поставлял этот шрифт, поэтому фактически использовал системный fallback. | Manrope подключён через `next/font` с self-hosting, preload, `display: swap`, только Latin/Cyrillic и без внешнего runtime-запроса. |

## Сознательно оставлено

- Safari и Firefox не объявлены проверенными: в доступном окружении присутствует только Chromium-based браузер. Нужен отдельный ручной проход на актуальных Safari/Firefox; поэтому work item cross-browser остаётся открытым.
- Реальные переходы во внешние Telegram/MAX проверены по URL, target/rel и доступности endpoints; тестовые сообщения не отправлялись.
- Draft/published проверены без изменения production-контента: public API отдаёт опубликованную статью и не раскрывает drafts. Создание/снятие тестовой статьи не выполнялось.
- Агрессивный pentest, destructive проверки persistence и restore не проводились. Backup/restore уже проверялся при подготовке VPS; в этой задаче подтверждены наличие согласованных архивов и health runtime.
- Локальная Docker-сборка была недоступна из-за остановленного Docker daemon. Обязательный production Docker build выполняется штатно на VPS перед обновлением контейнера.
- В логах присутствуют исторические ошибки периода первичной настройки 11 августа; после текущего стабильного запуска контейнеры не перезапускались и актуальных повторяющихся ошибок не обнаружено.

## Итог по P6

Финальная оптимизация изображений и шрифтов, Core Web Vitals, accessibility, desktop/mobile и исправление существенных дефектов выполнены. Cross-browser work item остаётся открытым до отдельной проверки Safari/Firefox.

## Follow-up задачи 019 — финальная визуальная полировка

Дата проверки: 12 августа 2026 года.

- В едином Hero H1 восстановлен утверждённый акцент «буддийских статуэток»: акцентная строка использует самостоятельный responsive `clamp()`, заметно крупнее соседних строк и сохраняет качественные переносы на 360, 390, 768, 1024 и 1440 px.
- Основные уровни Display, H1, H2, H3, Body, Small и Eyebrow унифицированы в существующей типографической системе без замены self-hosted Manrope и без новых декоративных шрифтов.
- Видеосекция поднята композиционно, технический eyebrow заменён на «Экспертный разбор», добавлены смысловой заголовок и короткий контекст. До взаимодействия показывается настоящий RuTube thumbnail 640×360; он хранится локально и выводится через `next/image`.
- Lazy embed сохранён: до Play iframe отсутствует, после действия создаётся один официальный `https://rutube.ru/play/embed/…/`; frame остаётся 16:9 без CLS и horizontal overflow.
- Локальный финальный build проверен в Safari 26.5 и Firefox 147.0.1 на desktop/mobile. Проверены главная, Hero/slider, атрибуция, preview/Play, CTA, consent, финальная секция/footer, `/blog`, production-статья и `/privacy`; browser-specific Critical/High-дефекты не обнаружены.
- Существующая production-статья `/blog/buddhist-sculpture-attribution/` подтверждена в списке блога; проверены title/excerpt, rich content/headings, cover, SEO title/description, canonical, Open Graph и `BlogPosting` JSON-LD. Контент и CMS schema не изменялись.
- Production Docker build, smoke-check и итоговые Lighthouse показатели зафиксированы ниже после deployment задачи 019.

Итоговые Lighthouse показатели задачи 019:

| Режим | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | 97 | 100 | 100 | 100 | 1,1 с | 0 | 40 мс |
| Desktop | 92 | 100 | 100 | 100 | 0,7 с | 0 | 10 мс |

Первый mobile-run после deployment дал 79 при LCP 2,4 с и TBT 430 мс; немедленный повтор — 97 при LCP 1,1 с и TBT 40 мс. Повтор воспроизвёл baseline задачи 018, поэтому первый результат отнесён к лабораторному шуму холодного запуска, а не к устойчивой регрессии. Desktop Performance 92 ниже прошлого 96, но LCP 0,7 с, CLS 0 и TBT 10 мс не показывают существенного ухудшения пользовательских метрик.

Production Docker build и deployment commit `71040e3` завершились успешно; главная, блог, статья, privacy и health endpoint вернули HTTP 200, frontend/Directus/PostgreSQL healthy. После production-проверки P6 закрыт: выполнены все восемь из восьми work items.

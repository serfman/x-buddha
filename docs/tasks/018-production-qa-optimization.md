# 018 — Production QA & Optimization

## Цель

Провести финальный комплексный QA production-версии X-Buddha, исправить обнаруженные проблемы и оптимизировать сайт перед финальной приёмкой.

Работать по принципу:

найти → оценить → исправить → перепроверить.

Не ограничиваться созданием отчёта.

Не выполнять редизайн утверждённого интерфейса и не менять продуктовую архитектуру без объективной необходимости.

Production:

- [https://xbuddha.org](https://xbuddha.org)

- [https://admin.xbuddha.org](https://admin.xbuddha.org)

В рамках задачи также заменить существующую RuTube-заглушку реальным видео:

[https://rutube.ru/video/2c3be6ec126a5bbb56fe377f14346461/](https://rutube.ru/video/2c3be6ec126a5bbb56fe377f14346461/)

---

# Перед началом изучить

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

- существующую SEO/analytics/legal документацию;

- актуальные production deployment reports;

- текущую реализацию сайта;

- текущий файл задачи.

Сначала определить существующие work items P6 и проводить QA с учётом их фактического состава.

---

# 1. RuTube

Заменить существующую централизованную RuTube-заглушку реальным видео:

`https://rutube.ru/video/2c3be6ec126a5bbb56fe377f14346461/`

Использовать существующую архитектуру видео.

Не хардкодить URL в нескольких компонентах.

Проверить:

- desktop;

- mobile;

- aspect ratio;

- отсутствие layout shift;

- корректное воспроизведение;

- отсутствие horizontal overflow.

Не загружать тяжёлый video player раньше, чем это необходимо.

Если возможно в существующей архитектуре без неоправданного усложнения, использовать lazy loading.

После подключения актуализировать соответствующий work item P2.

---

# 2. Functional QA

Проверить production-сайт целиком.

Минимум:

- `/`;

- `/blog`;

- существующие `/blog/[slug]`;

- `/privacy`;

- 404;

- sitemap.xml;

- robots.txt;

- admin link;

- Telegram;

- MAX;

- RuTube;

- header/navigation;

- все CTA;

- slider;

- блок принципов атрибуции;

- финальный CTA;

- footer;

- cookie consent.

Проверить внутренние и внешние ссылки.

Не должно быть dead links.

---

# 3. Blog / Directus

Проверить production-сценарий:

Directus

→ Next.js

→ Blog.

Проверить:

- список статей;

- опубликованную статью;

- title;

- excerpt;

- rich content;

- cover;

- SEO title;

- SEO description;

- Open Graph;

- draft/published;

- 404 для отсутствующей статьи;

- корректную обработку недоступности CMS.

Не изменять production-контент без необходимости.

---

# 4. Responsive QA

Проверить минимум:

- 360 px;

- 390 px;

- 768 px;

- 1024 px;

- 1440 px.

Дополнительно проверить промежуточные размеры при обнаружении breakpoint-проблем.

Проверить:

- horizontal overflow;

- typography;

- переносы;

- spacing;

- изображения;

- navigation;

- CTA;

- touch targets;

- slider;

- attribution section;

- video;

- blog;

- privacy;

- cookie banner;

- footer.

Исправить обнаруженные responsive-проблемы.

---

# 5. Cross-browser

По возможности проверить актуальные:

- Chrome;

- Safari;

- Firefox.

Особое внимание Safari:

- sticky/fixed elements;

- viewport units;

- изображения;

- overflow;

- video/embed;

- cookie consent.

Если полноценная автоматизированная проверка конкретного браузера недоступна, зафиксировать это отдельно, а не считать её выполненной.

---

# 6. Performance

Провести Lighthouse/PageSpeed-проверки production.

Проверить минимум:

- Performance;

- Accessibility;

- Best Practices;

- SEO.

Отдельно проанализировать Core Web Vitals:

- LCP;

- CLS;

- INP или доступный лабораторный эквивалент.

Не оптимизировать ради формального балла ценой визуального качества.

Приоритет:

1. реальные проблемы UX;

2. Core Web Vitals;

3. mobile performance;

4. unnecessary JS;

5. изображения;

6. fonts;

7. third-party scripts.

---

# 7. Images

Проверить:

- размеры исходных изображений;

- Next/Image там, где применимо;

- responsive sizes;

- lazy loading;

- preload только действительно критичных изображений;

- отсутствие неоправданно больших ресурсов;

- alt;

- CLS.

Не ухудшать качество ключевых изображений ради минимальной экономии трафика.

---

# 8. Fonts

Проверить:

- способ загрузки;

- количество начертаний;

- preload;

- font-display;

- отсутствие лишних font resources;

- CLS/FOUT.

Оптимизировать только при объективной необходимости.

---

# 9. JavaScript / dependencies

Проверить:

- bundle;

- client components;

- third-party JS;

- unused dependencies;

- console errors;

- hydration warnings.

Не выполнять архитектурный рефакторинг только ради небольшого уменьшения bundle.

Исправить очевидные проблемы.

---

# 10. Accessibility

Проверить:

- semantic HTML;

- H1–H3 hierarchy;

- landmark elements;

- keyboard navigation;

- focus;

- contrast;

- aria labels;

- links/buttons;

- alt;

- touch targets;

- cookie banner.

Основные пользовательские сценарии должны быть доступны с клавиатуры.

Исправить найденные существенные проблемы.

---

# 11. SEO QA

Проверить production:

- title;

- description;

- canonical;

- robots;

- sitemap;

- Open Graph;

- Twitter Card;

- JSON-LD;

- H1;

- heading hierarchy;

- indexability;

- blog metadata;

- article structured data;

- 404;

- `/offer` → 404;

- `/privacy`;

- отсутствие `.ru` production URLs.

Проверить отсутствие случайного `noindex` на индексируемых страницах.

---

# 12. Analytics

Проверить production ID:

`111463994`

Проверить:

- consent;

- SPA PageView;

- `messenger_telegram_click`;

- `messenger_max_click`;

- отсутствие duplicate initialization.

Ручные цели Метрики считаются внешней настройкой и не должны блокировать P6, если сайт корректно отправляет события.

---

# 13. Cookie consent

Повторно проверить:

## Accept

Первое посещение

→ banner

→ «Принять»

→ Метрика загружается

→ reload

→ banner не появляется.

## Reject

Первое посещение

→ banner

→ «Отклонить»

→ Метрика не загружается

→ reload

→ banner не появляется.

Основной сайт должен работать в обоих случаях.

Если автоматизированная очистка storage недоступна, выполнить максимально возможную проверку и явно указать оставшийся ручной сценарий.

---

# 14. Security

Провести безопасный production security review без destructive/pentest-действий.

Проверить:

- HTTPS;

- SSL;

- security headers;

- отсутствие directory listing;

- отсутствие публичных secrets;

- отсутствие `.env`;

- Directus admin isolation;

- public Directus permissions;

- отсутствие лишних публичных API-возможностей;

- CORS;

- публичные порты;

- server disclosure;

- SSH configuration согласно DEPLOY;

- Docker services.

Снаружи должны быть доступны только необходимые:

- 22;

- 80;

- 443.

Не должны быть публично доступны:

- 3000;

- 8055;

- 5432.

Не проводить агрессивный security scan production.

---

# 15. Infrastructure health

Проверить VPS:

- containers;

- healthchecks;

- restart policy;

- RAM;

- swap;

- disk;

- Docker disk usage;

- application logs;

- Nginx logs;

- SSL renewal;

- backup.

Не должно быть:

- restart loops;

- критических ошибок;

- быстро растущих логов;

- очевидного memory pressure.

---

# 16. Error handling

Проверить:

- Next.js 404;

- неизвестный blog slug;

- временно недоступный Directus;

- broken image fallback при наличии;

- внешние сервисы.

Пользователь не должен видеть технические stack traces или внутреннюю информацию.

---

# 17. Исправление проблем

Все обнаруженные проблемы классифицировать:

## Critical

Безопасность, недоступность сайта, потеря данных.

Исправить обязательно.

## High

Сломанный пользовательский сценарий, серьёзная mobile/SEO/performance проблема.

Исправить обязательно.

## Medium

Заметная проблема UX/качества.

Исправить, если изменение безопасно и локально.

## Low

Косметика или потенциальное улучшение.

Не выполнять автоматически, если это меняет утверждённый дизайн или создаёт технический долг.

Зафиксировать в отчёте.

---

# 18. Повторная проверка

После исправлений повторить затронутые тесты.

Не считать проблему закрытой только по факту изменения кода.

Проверить production после deployment.

---

# 19. QA report

Создать:

`docs/audits/018-production-qa-report.md`

Зафиксировать:

- что проверено;

- найденные проблемы;

- severity;

- что исправлено;

- что сознательно оставлено;

- Lighthouse/Performance результаты;

- оставшиеся ручные проверки;

- blockers, если есть.

Не записывать secrets.

---

# 20. Documentation / progress

Обновить:

- `docs/project-plan.md`;

- `docs/TODO.md`;

- `CHANGELOG.md`;

- при необходимости `DEPLOY.md`.

Пересчитать P2 после подключения RuTube.

P6 закрывать только по фактически выполненным work items.

Не назначать 100% субъективно.

---

# 21. Deployment

После исправлений:

- lint;

- build;

- production Docker build;

- diff review;

- commit;

- push `origin/main`;

- штатный production deployment;

- final production smoke test.

Не включать несвязанные пользовательские изменения.

---

# Definition of Done

- реальный RuTube подключён;

- функциональные сценарии проверены;

- responsive QA выполнен;

- blog/Directus проверены;

- performance проверен и существенные проблемы исправлены;

- accessibility проверена;

- SEO проверено;

- analytics проверена;

- cookie consent проверен;

- security review выполнен;

- infrastructure health проверен;

- Critical/High issues отсутствуют;

- исправленные проблемы повторно проверены;

- production работает после deployment;

- QA report создан;

- документация обновлена;

- commit/push выполнены;

- P2/P6/P7 пересчитаны только по фактически выполненным work items.

В конце вывести:

ПРОГРЕСС X-BUDDHA

P0 ...

...

P7 ...
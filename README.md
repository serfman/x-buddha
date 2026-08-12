# X-Buddha

Production-сайт экспертного центра по оценке, атрибуции и выкупу буддийских статуэток и артефактов. Основной сайт опубликован на [xbuddha.org](https://xbuddha.org), статьи управляются через Directus на [admin.xbuddha.org](https://admin.xbuddha.org).

Проект находится в режиме `Maintenance`: разработка завершена, дальнейшие изменения выполняются отдельными задачами через Git и штатный deployment-процесс.

## Стек

- Next.js 16 и React 19 с App Router;
- TypeScript в strict-режиме;
- Tailwind CSS 3;
- Directus 11 и PostgreSQL для блога;
- Docker Compose, Nginx и Let's Encrypt в production.

## Основные команды

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run start
```

Локальный Directus запускается отдельно по инструкции CMS. Production-обновления выполняются только по `DEPLOY.md` после успешных `lint` и `build`.

## Документация

- [План проекта](docs/project-plan.md)
- [Frontend-архитектура](docs/architecture/frontend-prototype.md)
- [Дизайн-направление](docs/ui/design-direction.md)
- [Техническое задание клиента](docs/client_tz.md)
- [Инструкция владельцу по статьям](docs/cms/client-guide.md)
- [Техническая инструкция Directus](docs/cms/directus.md)
- [Production deployment и эксплуатация](DEPLOY.md)
- [Задачи поддержки](docs/TODO.md)
- [Правила разработки](PROJECT_RULES.md)
- [История изменений](CHANGELOG.md)

## Известные ограничения

- На сайте нет форм и загрузки файлов: обращения и фотографии передаются через Telegram или MAX.
- На сайте нет checkout и онлайн-оплаты; публичная оферта не публикуется.
- Directus предназначен прежде всего для управления статьями блога.

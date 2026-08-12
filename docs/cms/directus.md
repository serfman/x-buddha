# Directus для блога X-Buddha

Этот документ — техническая инструкция по развёртыванию CMS и работе редактора. Простая инструкция для владельца сайта находится в [руководстве по статьям](client-guide.md), архитектурные причины и data flow — в [архитектуре frontend](../architecture/frontend-prototype.md#15-блог-и-directus).

## Первичная настройка

1. Скопировать `.env.example` в локальный `.env` и заменить все значения `replace-with-*`. Файл `.env` не коммитить.
2. Запустить CMS: `npm run cms:up`.
3. Применить версионируемую модель: `npm run cms:schema:apply`.
4. Настроить минимальные публичные права: `npm run cms:configure-access`.
5. Запустить frontend командой `npm run dev`.

Production-развёртывание, PostgreSQL, применение snapshot, backup и первый admin описаны в корневом [DEPLOY.md](../../DEPLOY.md). Публичный `DIRECTUS_URL` формирует URL файлов, а серверные API-запросы внутри Docker используют `DIRECTUS_INTERNAL_URL`; административные credentials frontend во время работы не получает.

## Доступ к Directus Studio

Ссылка-шестерёнка в footer берётся из `NEXT_PUBLIC_ADMIN_URL`; production-значение зафиксировано в `.env.example`. Если переменная отсутствует или содержит некорректный HTTP(S) URL, ссылка не выводится. Studio использует штатную авторизацию существующего Directus instance: отдельные `/admin`, login-страница, proxy-auth и база пользователей во frontend не создаются.

Сама ссылка не является защитой. Для административных пользователей обязательны сильные пароли и роли с минимально необходимыми правами. Public policy не имеет app/admin access и ограничена чтением опубликованных статей и изображений через `npm run cms:configure-access`.

## Создание статьи

1. Открыть Directus Studio → Content → Articles → Create Item.
2. Оставить `status` равным `draft`.
3. Заполнить `title`, уникальный латинский `slug`, краткий `excerpt`, rich content в `content` и `published_at`.
4. При необходимости загрузить `cover` и отдельный `og_image`.
5. Сохранить. Draft не доступен через публичный API и не появляется на сайте.

Rich-text редактор поддерживает абзацы, H2/H3, маркированные и нумерованные списки, strong/emphasis, ссылки, изображения и цитаты. Для изображений заполнить осмысленные Title/Description: они используются как alt-текст.

## Публикация и снятие с публикации

- Для публикации сменить `status` на `published`, проверить `published_at` и сохранить. Статья появится на `/blog` не позднее чем через 5 минут без rebuild.
- Для снятия с публикации вернуть `status` в `draft`. После revalidation статья исчезнет из списка, а её прежний URL вернёт 404.
- Для редактирования открыть запись, изменить поля и сохранить; `updated_at` обновится автоматически.

## SEO

- `seo_title` заменяет `title` только в metadata; если пуст, используется `title`.
- `seo_description` заменяет `excerpt` только в metadata; если пуст, используется `excerpt`.
- Для social preview используется `og_image`, затем `cover`, затем глобальный `/og.png` сайта.

Перед публикацией проверить заголовок, excerpt, дату, cover, структуру H2/H3, ссылки, изображения и SEO preview.

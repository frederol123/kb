# 🟢 Анализ SEO — immortal-code.ru

## Критическая проблема (уже исправлена)

- [x] **Sitemap.xml — 500 ошибка** — права 600 на `SitemapController.php` (php-fpm не мог прочитать). Поставил 644
- [x] **robots.txt без sitemap** — добавил `Sitemap: https://immortal-code.ru/sitemap.xml`

---

## Что хорошо

- [x] SSL — валидный, до 1 октября 2026
- [x] Скорость — TTFB 182ms, полная загрузка 183ms, страница 3.2KB
- [x] robots.txt — открыт для всех, ничего не заблокировано
- [x] meta description + keywords на главной — прописаны грамотно
- [x] OG-теги (og:title, og:description) — на главной есть
- [x] Favicon — все форматы (svg, ico, png 16/32, apple-touch)
- [x] theme-color — задан (#3476F5)
- [x] Яндекс.Вебмастер — тег mailru-domain присутствует
- [x] Sitemap генерирует 8 статических + все анкеты (published + private)

---

## Что сделано по улучшениям

### Приоритет 2 (выполнено) — JSON-LD (Organization + WebSite)
- [x] Добавлен `application/ld+json` в `<head>` welcome.blade.php
- [x] Organization: название, URL, лого, телефон, описание
- [x] WebSite: название, URL, язык, привязка к Organization
- [x] Используется `@graph` для двух сущностей в одном блоке

### Приоритет 3 (выполнено) — Canonical URL
- [x] `<link rel="canonical" href="{{ url()->current() }}">` добавлен в `<head>`
- [x] Работает динамически — на каждой странице свой URL

### Приоритет 4 (выполнено) — HSTS
- [x] `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` в nginx
- [x] Скрыт `X-Powered-By: PHP/...` через `fastcgi_hide_header`

---

## Что ещё можно сделать (не трогать без запроса)

### Приоритет 1 — SSR/Prerender
- [ ] SPA — внутренние страницы не индексируются поисковиками
- [ ] Googlebot (и Яндекс) видят пустую оболочку SPA
- [ ] Варианты: SSR, SSG, Prerender.io, Blade-шаблоны

### Приоритет 5 — Яндекс.Вебмастер
- [ ] Проверить добавление сайта в Яндекс.Вебмастер

### Нюансы помельче
- [ ] Кеширование статики (CSS/JS с хэшами) — настроить far-future expires
- [ ] Sitemap не включает /delivery
- [ ] Sitemap не включает анкеты drafts (только published+private)

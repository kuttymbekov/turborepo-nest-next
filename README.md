# Журнал работ — Construction Work Log

Внутренний инструмент для ведения учёта выполненных работ на строительном объекте.

## Стек

| Слой | Технология | Причина выбора |
|---|---|---|
| Монорепозиторий | pnpm + Turborepo | Единое управление зависимостями, параллельный запуск |
| Бэкенд | NestJS (Express) | Модульная архитектура, DI из коробки, TypeScript-first |
| База данных | PostgreSQL | Реляционная СУБД, полноценные транзакции, надёжность |
| ORM | Prisma | Типобезопасные запросы, миграции, автосид |
| Фронтенд | Next.js 16 (App Router) + React 19 | SSR/SSG, файловая маршрутизация |
| UI-библиотека | shadcn/ui + @base-ui/react | Самые трендовые в 2025, доступность (WAI-ARIA), Tailwind v4 |
| Формы | react-hook-form + Zod | Производительность, строгая типизация схем |
| Стейт-менеджер | @tanstack/react-query | Server state из коробки, кеширование, инвалидация |
| Стили | Tailwind CSS v4 | Утилитарный подход, минимальный CSS-бандл |
| Нотификации | Sonner | Современный toast-менеджер |

## Функциональность

- Список записей журнала с сортировкой и фильтрацией по дате
- Добавление записи через форму с валидацией (react-hook-form + Zod)
- Редактирование существующих записей
- Удаление с подтверждением
- Справочник видов работ (предзаполнен 10 позициями, расширяем)

## Запуск через Docker (рекомендуется)

```bash
# Клонировать репозиторий
git clone <repo-url>
cd fullstack-turbo

# Создать .env файлы
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env

# Поднять всё одной командой
docker-compose up --build

# Приложение доступно на http://localhost:3001
```

## Локальный запуск (без Docker)

### Требования
- Node.js >= 18
- pnpm >= 8
- PostgreSQL (локально или через Docker)

### 1. Запустить PostgreSQL

```bash
docker run -d \
  --name workjournal-db \
  -e POSTGRES_DB=workjournal \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Настроить переменные окружения

Файлы `.env` уже созданы с дефолтными значениями. При необходимости скопируйте примеры:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env
```

### 3. Установить зависимости

```bash
pnpm install
```

### 4. Применить миграции и заполнить справочник видов работ

```bash
cd apps/backend
npx prisma migrate dev --name init
npx prisma db seed
cd ../..
```

### 5. Запустить в dev-режиме

```bash
pnpm dev
# Фронтенд: http://localhost:3001
# Бэкенд:   http://localhost:3000
```

## API-эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| GET | /work-types | Список видов работ |
| POST | /work-types | Создать вид работ |
| GET | /work-entries?from=&to=&sort=asc\|desc | Список записей с фильтрацией |
| POST | /work-entries | Создать запись |
| PUT | /work-entries/:id | Обновить запись |
| DELETE | /work-entries/:id | Удалить запись |

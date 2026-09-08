# Проектная работа «Веб-ларёк»

«Веб-ларёк» — интернет-магазин товаров для веб-разработчиков.

Пользователь может:

- просматривать каталог товаров;
- открывать подробную информацию о товаре;
- добавлять товары в корзину;
- удалять товары из корзины;
- выбирать способ оплаты;
- вводить адрес доставки;
- вводить контактные данные;
- оформлять заказ;
- получать сообщение об успешном оформлении заказа.

## Стек

- HTML
- SCSS
- TypeScript
- Vite

## Структура проекта

```text
src/
├── components/
│   ├── base/
│   │   ├── Api.ts
│   │   ├── Component.ts
│   │   └── Events.ts
│   ├── Models/
│   │   ├── Basket.ts
│   │   ├── Buyer.ts
│   │   └── ProductCatalog.ts
│   ├── View/
│   │   ├── Basket.ts
│   │   ├── Card.ts
│   │   ├── CardWithCategory.ts
│   │   ├── CardBasket.ts
│   │   ├── CardCatalog.ts
│   │   ├── CardPreview.ts
│   │   ├── ContactsForm.ts
│   │   ├── Form.ts
│   │   ├── Gallery.ts
│   │   ├── Modal.ts
│   │   ├── OrderForm.ts
│   │   ├── Page.ts
│   │   ├── Success.ts
│   │   └── index.ts
│   └── WebLarekApi.ts
├── types/
│   └── index.ts
├── utils/
│   ├── constants.ts
│   └── utils.ts
├── scss/
│   └── styles.scss
└── main.ts
```

## Установка

Установите зависимости:

```bash
npm install
```

Создайте `.env` в корне проекта на основе `.env.example`:

```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Запуск проекта:

```bash
npm run dev
```

Сборка:

```bash
npm run build
```

Просмотр собранной версии:

```bash
npm run preview
```

---

# Архитектура

Приложение построено по архитектуре MVP — Model-View-Presenter.

## Model

Модели:

- хранят данные приложения;
- изменяют данные;
- предоставляют публичные методы получения данных;
- выполняют связанную с данными бизнес-логику;
- после изменения состояния генерируют события.

Модели не работают с DOM.

## View

Представления:

- работают с DOM;
- отображают переданные данные;
- обрабатывают пользовательские действия;
- генерируют события либо вызывают переданные Presenter callback-функции.

View не хранит данные приложения и не изменяет модели напрямую.

## Presenter

Presenter реализован в:

```text
src/main.ts
```

Он связывает Model и View.

Общее направление взаимодействия:

```text
View → событие/callback → Presenter → Model
```

После изменения модели:

```text
Model → событие → Presenter → View
```

Presenter не хранит дублирующее состояние каталога, корзины, покупателя или открытого модального экрана.

---

# Типы данных

Типы находятся в:

```text
src/types/index.ts
```

## `IApi`

Интерфейс объекта для выполнения HTTP-запросов.

```ts
interface IApi {
    get<T extends object>(
        uri: string
    ): Promise<T>;

    post<T extends object>(
        uri: string,
        data: object,
        method?: 'POST' | 'PUT' | 'DELETE'
    ): Promise<T>;
}
```

## `IProduct`

Описывает товар.

```ts
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

## `TPayment`

Тип способа оплаты:

```ts
type TPayment = 'card' | 'cash' | '';
```

## `IBuyer`

Данные покупателя:

```ts
interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
```

## `IProductsResponse`

Ответ API со списком товаров:

```ts
interface IProductsResponse {
    total: number;
    items: IProduct[];
}
```

## `IOrder`

Данные оформляемого заказа:

```ts
interface IOrder extends IBuyer {
    total: number;
    items: string[];
}
```

## `IOrderResult`

Ответ API после оформления заказа:

```ts
interface IOrderResult {
    id: string;
    total: number;
}
```

## Типы View

### `TCardBase`

```ts
type TCardBase = Pick<
    IProduct,
    'title' | 'price'
>;
```

### `TCardCatalog`

```ts
type TCardCatalog =
    TCardBase &
    Pick<IProduct, 'category' | 'image'>;
```

### `TCardPreview`

```ts
type TCardPreview =
    TCardCatalog &
    Pick<IProduct, 'description'> & {
        buttonText: string;
        buttonDisabled: boolean;
    };
```

### `TCardBasket`

```ts
type TCardBasket = TCardBase & {
    index: number;
};
```

### `IGalleryView`

```ts
interface IGalleryView {
    items: HTMLElement[];
}
```

### `IBasketView`

```ts
interface IBasketView {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}
```

### `IPageView`

```ts
interface IPageView {
    counter: number;
}
```

### `IModalView`

```ts
interface IModalView {
    content: HTMLElement;
}
```

### `IFormView`

```ts
interface IFormView {
    valid: boolean;
    errors: string;
}
```

### `IOrderFormView`

```ts
interface IOrderFormView extends IFormView {
    payment: TPayment;
    address: string;
}
```

### `IContactsFormView`

```ts
interface IContactsFormView extends IFormView {
    email: string;
    phone: string;
}
```

### `ISuccessView`

```ts
interface ISuccessView {
    total: number;
}
```

---

# Базовые классы

## `Api`

Базовый класс стартовой заготовки для выполнения HTTP-запросов.

### Конструктор

```ts
constructor(
    baseUrl: string,
    options: RequestInit = {}
)
```

### Поля

- `baseUrl: string` — базовый адрес API;
- `options: RequestInit` — настройки запросов.

### Методы

```ts
protected handleResponse<T>(
    response: Response
): Promise<T>
```

Обрабатывает ответ сервера.

```ts
get<T extends object>(
    uri: string
): Promise<T>
```

Выполняет GET-запрос.

```ts
post<T extends object>(
    uri: string,
    data: object,
    method?: 'POST' | 'PUT' | 'DELETE'
): Promise<T>
```

Отправляет данные на сервер.

---

## `EventEmitter`

Брокер событий, реализующий паттерн Observer («Наблюдатель»).

### Конструктор

```ts
constructor()
```

### Поле

```ts
_events: Map<EventName, Set<Subscriber>>
```

Хранит зарегистрированные обработчики.

### Методы

```ts
on<T extends object>(
    eventName: EventName,
    callback: (event: T) => void
): void
```

Добавляет обработчик события.

```ts
off(
    eventName: EventName,
    callback: Subscriber
): void
```

Удаляет обработчик.

```ts
emit<T extends object>(
    eventName: string,
    data?: T
): void
```

Генерирует событие.

```ts
onAll(
    callback: (event: EmitterEvent) => void
): void
```

Подписывает обработчик на все события.

```ts
offAll(): void
```

Удаляет все обработчики.

```ts
trigger<T extends object>(
    eventName: string,
    context?: Partial<T>
): (data: T) => void
```

Возвращает callback, генерирующий событие.

---

## `Component<T>`

Абстрактный базовый класс представлений.

### Конструктор

```ts
constructor(container: HTMLElement)
```

### Поле

```ts
container: HTMLElement
```

Корневой DOM-элемент представления.

### Методы

```ts
protected setImage(
    element: HTMLImageElement,
    src: string,
    alt?: string
): void
```

Устанавливает изображение.

```ts
render(
    data?: Partial<T>
): HTMLElement
```

Передаёт данные сеттерам представления и возвращает его корневой DOM-элемент.

---

# Модели

## `ProductCatalog`

Хранит каталог товаров и выбранный для подробного просмотра товар.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

```ts
private products: IProduct[]
private preview: IProduct | null
private readonly events: IEvents
```

### Методы

```ts
setProducts(
    products: IProduct[]
): void
```

Сохраняет каталог и генерирует `catalog:changed`.

```ts
getProducts(): IProduct[]
```

Возвращает товары.

```ts
getProductById(
    id: string
): IProduct | undefined
```

Возвращает товар по идентификатору.

```ts
setPreview(
    product: IProduct
): void
```

Сохраняет выбранный товар и генерирует `preview:changed`.

```ts
getPreview(): IProduct | null
```

Возвращает выбранный товар.

События модели не передают данные модели в payload.

---

## `Basket`

Модель корзины.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

```ts
private items: IProduct[]
private readonly events: IEvents
```

### Методы

```ts
getItems(): IProduct[]
```

Возвращает товары корзины.

```ts
addItem(
    product: IProduct
): void
```

Добавляет товар и генерирует `basket:changed`.

```ts
removeItem(
    product: IProduct
): void
```

Удаляет товар и генерирует `basket:changed`.

```ts
clear(): void
```

Очищает корзину.

```ts
getTotal(): number
```

Возвращает общую стоимость.

```ts
getCount(): number
```

Возвращает количество товаров.

```ts
hasItem(
    id: string
): boolean
```

Проверяет наличие товара.

---

## `Buyer`

Хранит данные покупателя.

### Конструктор

```ts
constructor(events: IEvents)
```

### Поля

```ts
private payment: TPayment
private address: string
private email: string
private phone: string
private readonly events: IEvents
```

### Методы

```ts
setData(
    data: Partial<IBuyer>
): void
```

Обновляет данные и генерирует `buyer:changed`.

```ts
getData(): IBuyer
```

Возвращает данные покупателя.

```ts
clear(): void
```

Очищает данные.

```ts
validate():
    Partial<Record<keyof IBuyer, string>>
```

Возвращает ошибки заполнения полей.

---

# API приложения

## `WebLarekApi`

Отвечает за взаимодействие с API интернет-магазина.

Использует композицию: получает объект, реализующий `IApi`.

### Конструктор

```ts
constructor(api: IApi)
```

### Поле

```ts
private api: IApi
```

### Методы

```ts
getProducts():
    Promise<IProductsResponse>
```

Получает каталог.

```ts
createOrder(
    order: IOrder
): Promise<IOrderResult>
```

Отправляет заказ.

---

# Представления

## `Card<T>`

Абстрактный базовый класс карточек.

### Конструктор

```ts
constructor(
    container: HTMLElement
)
```

### Поля

```ts
protected readonly titleElement: HTMLElement
protected readonly priceElement: HTMLElement
```

### Сеттеры

```ts
set title(value: string)
```

Отображает название.

```ts
set price(
    value: number | null
)
```

Отображает цену.

---

## `CardWithCategory<T>`

Абстрактный класс для карточек, содержащих категорию товара.

Наследуется от `Card`.

### Конструктор

```ts
constructor(
    container: HTMLElement
)
```

### Поле

```ts
protected readonly categoryElement: HTMLElement
```

### Сеттер

```ts
set category(
    value: string
)
```

Устанавливает текст категории и CSS-класс категории.

---

## `CardCatalog`

Карточка товара в каталоге.

Наследуется от `CardWithCategory<TCardCatalog>`.

### Конструктор

```ts
constructor(
    container: HTMLElement,
    onClick: () => void
)
```

`onClick` вызывается при выборе карточки.

### Поле

```ts
private readonly imageElement: HTMLImageElement
```

### Сеттер

```ts
set image(
    value: string
)
```

Устанавливает изображение.

Также наследует:

- `title`;
- `price`;
- `category`.

Карточка не хранит `id` товара.

---

## `CardPreview`

Отображает выбранный товар в модальном окне.

### Конструктор

```ts
constructor(
    container: HTMLElement,
    events: IEvents
)
```

### Поля

```ts
private readonly imageElement: HTMLImageElement
private readonly descriptionElement: HTMLElement
private readonly buttonElement: HTMLButtonElement
private readonly events: IEvents
```

### Сеттеры

```ts
set image(value: string)
set description(value: string)
set buttonText(value: string)
set buttonDisabled(value: boolean)
```

Также наследует:

```ts
title
price
category
```

При нажатии основной кнопки генерирует:

```text
card:action
```

Товар Presenter получает через:

```ts
productCatalog.getPreview()
```

---

## `CardBasket`

Карточка товара корзины.

### Конструктор

```ts
constructor(
    container: HTMLElement,
    onDelete: () => void
)
```

### Поля

```ts
private readonly indexElement: HTMLElement
private readonly deleteButton: HTMLButtonElement
```

### Сеттер

```ts
set index(
    value: number
)
```

Также наследует `title` и `price`.

Карточка не хранит идентификатор товара.

---

## `Gallery`

Представление каталога.

### Конструктор

```ts
constructor(
    container: HTMLElement
)
```

### Сеттер

```ts
set items(
    value: HTMLElement[]
)
```

Заменяет содержимое каталога переданными карточками.

---

## `Basket` View

Представление корзины.

### Конструктор

```ts
constructor(
    container: HTMLElement,
    events: IEvents
)
```

### Поля

```ts
private readonly listElement: HTMLElement
private readonly totalElement: HTMLElement
private readonly orderButton: HTMLButtonElement
private readonly events: IEvents
```

### Сеттеры

```ts
set items(
    value: HTMLElement[]
)
```

Устанавливает карточки.

```ts
set total(
    value: number
)
```

Отображает стоимость.

```ts
set valid(
    value: boolean
)
```

Управляет доступностью кнопки оформления.

При пустом `items` сообщение «Корзина пуста» отображается CSS.

---

## `Page`

Представление шапки.

В качестве контейнера получает `.header`.

### Конструктор

```ts
constructor(
    container: HTMLElement,
    events: IEvents
)
```

### Поля

```ts
private readonly basketButton: HTMLButtonElement
private readonly counterElement: HTMLElement
private readonly events: IEvents
```

### Сеттер

```ts
set counter(
    value: number
)
```

Отображает количество товаров корзины.

При клике по корзине генерирует `basket:open`.

---

## `Modal`

Модальное окно.

### Конструктор

```ts
constructor(
    container: HTMLElement,
    events: IEvents
)
```

### Поля

```ts
private readonly closeButton: HTMLButtonElement
private readonly contentElement: HTMLElement
private readonly events: IEvents
```

### Сеттер

```ts
set content(
    value: HTMLElement
)
```

### Методы

```ts
open(): void
close(): void
```

При клике на крестик или фон генерирует `modal:close`.

---

## `Form<T>`

Абстрактный базовый класс форм.

### Конструктор

```ts
constructor(
    form: HTMLFormElement,
    events: IEvents
)
```

### Поля

```ts
protected readonly form: HTMLFormElement
protected readonly events: IEvents
protected readonly submitButton: HTMLButtonElement
private readonly errorsElement: HTMLElement
```

### Сеттеры

```ts
set valid(
    value: boolean
)
```

Управляет `disabled` кнопки.

```ts
set errors(
    value: string
)
```

Отображает ошибки.

При изменении поля генерирует:

```text
<form>.<field>:change
```

При submit:

```text
<form>:submit
```

---

## `OrderForm`

Первый этап оформления заказа.

### Конструктор

```ts
constructor(
    container: HTMLFormElement,
    events: IEvents
)
```

### Поля

```ts
private readonly addressInput: HTMLInputElement
private readonly cardButton: HTMLButtonElement
private readonly cashButton: HTMLButtonElement
```

### Сеттеры

```ts
set payment(
    value: TPayment
)

set address(
    value: string
)
```

События:

```text
order.payment:change
order.address:change
order:submit
```

---

## `ContactsForm`

Второй этап оформления заказа.

### Конструктор

```ts
constructor(
    container: HTMLFormElement,
    events: IEvents
)
```

### Поля

```ts
private readonly emailInput: HTMLInputElement
private readonly phoneInput: HTMLInputElement
```

### Сеттеры

```ts
set email(
    value: string
)

set phone(
    value: string
)
```

События:

```text
contacts.email:change
contacts.phone:change
contacts:submit
```

---

## `Success`

Представление успешно оформленного заказа.

### Конструктор

```ts
constructor(
    container: HTMLElement,
    events: IEvents
)
```

### Поля

```ts
private readonly descriptionElement: HTMLElement
private readonly closeButton: HTMLButtonElement
private readonly events: IEvents
```

### Сеттер

```ts
set total(
    value: number
)
```

Отображает списанную сумму.

При клике по кнопке генерирует:

```text
success:close
```

---

# События приложения

## События моделей

Состояние моделей через payload не передаётся.

| Событие | Payload | Описание |
| --- | --- | --- |
| `catalog:changed` | — | Изменился каталог |
| `preview:changed` | — | Изменился выбранный товар |
| `basket:changed` | — | Изменилась корзина |
| `buyer:changed` | — | Изменились данные покупателя |

Presenter получает состояние публичными методами моделей.

## Пользовательские события

| Событие | Payload | Описание |
| --- | --- | --- |
| `card:select` | `{ id: string }` | Выбрана карточка каталога |
| `card:action` | — | Купить или удалить выбранный товар |
| `basket:remove` | `{ id: string }` | Удалить товар из корзины |
| `basket:open` | — | Открыть корзину |
| `order:open` | — | Начать оформление |
| `order.payment:change` | `{ field: string, value: TPayment }` | Изменена оплата |
| `order.address:change` | `{ field: string, value: string }` | Изменён адрес |
| `order:submit` | — | Перейти к контактам |
| `contacts.email:change` | `{ field: string, value: string }` | Изменён email |
| `contacts.phone:change` | `{ field: string, value: string }` | Изменён телефон |
| `contacts:submit` | — | Отправить заказ |
| `modal:close` | — | Закрыть modal |
| `success:close` | — | Закрыть окно успеха |

---

# Работа Presenter

Статические представления создаются один раз:

- `Page`;
- `Gallery`;
- `Modal`;
- `CardPreview`;
- `Basket`;
- `OrderForm`;
- `ContactsForm`;
- `Success`.

Карточки каталога и корзины создаются динамически.

## Каталог

```text
API
→ ProductCatalog.setProducts()
→ catalog:changed
→ ProductCatalog.getProducts()
→ CardCatalog[]
→ Gallery
```

## Выбор товара

```text
CardCatalog
→ callback
→ card:select { id }
→ Presenter
→ ProductCatalog.getProductById(id)
→ ProductCatalog.setPreview(product)
→ preview:changed
→ CardPreview
```

## Корзина

```text
CardPreview
→ card:action
→ Presenter
→ Basket.addItem()/removeItem()
→ basket:changed
→ Presenter
→ Basket View + Page counter
```

Удаление:

```text
CardBasket
→ callback
→ basket:remove { id }
→ Presenter
→ Basket.removeItem()
```

## Формы

```text
Form
→ событие изменения
→ Presenter
→ Buyer.setData()
→ buyer:changed
→ Presenter
→ OrderForm + ContactsForm
```

## Оформление заказа

```text
contacts:submit
→ Presenter формирует IOrder
→ WebLarekApi.createOrder()
→ API
→ Success
```

После успешного заказа:

```ts
basket.clear();
buyer.clear();
```

---

# Основные принципы

- данные хранятся в моделях;
- View не хранит состояние приложения;
- Presenter не хранит дублирующее состояние;
- модели не работают с DOM;
- View не работает с API;
- модели генерируют события после изменения состояния;
- события моделей не передают копию состояния;
- Presenter получает данные публичными методами моделей;
- карточки не хранят `id` в `dataset`;
- базовые классы стартовой заготовки не расширяются;
- каждый класс карточки находится в отдельном файле;
- общая логика наследования вынесена в базовые классы;
- пустая корзина отображается средствами CSS;
- статические View создаются один раз.
# Проектная работа «Веб-ларёк»

Интернет-магазин товаров для веб-разработчиков.

Пользователь может:

- просматривать каталог товаров;
- открывать подробную информацию о товаре;
- добавлять товары в корзину;
- удалять товары из корзины;
- выбирать способ оплаты;
- вводить адрес доставки и контактные данные;
- оформлять заказ;
- получать информацию об успешно оформленном заказе.

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

## Установка и запуск

Установите зависимости:

```bash
npm install
```

Создайте файл `.env` в корне проекта на основе `.env.example`.

Содержимое:

```env
VITE_API_ORIGIN=https://larek-api.nomoreparties.co
```

Запустите проект в режиме разработки:

```bash
npm run dev
```

## Сборка проекта

```bash
npm run build
```

Для локального просмотра собранной версии:

```bash
npm run preview
```

---

# Архитектура

Приложение построено по архитектуре **MVP — Model-View-Presenter**.

## Model

Модели отвечают за:

- хранение данных;
- изменение данных;
- получение данных;
- валидацию данных;
- генерацию событий после изменения своего состояния.

Модели не работают с DOM.

## View

Представления отвечают за:

- отображение данных;
- работу со своими DOM-элементами;
- обработку действий пользователя;
- генерацию событий пользовательского интерфейса либо вызов переданного callback.

Представления не изменяют данные моделей напрямую.

## Presenter

Presenter реализован в файле:

```text
src/main.ts
```

Он связывает Model и View.

Основные направления взаимодействия:

```text
View → Presenter → Model
```

При изменении данных:

```text
Model → событие → Presenter → View
```

Presenter не хранит состояние каталога, корзины, покупателя или текущего модального окна.

Источником состояния приложения являются модели данных.

---

# Типы данных

Все основные типы и интерфейсы находятся в:

```text
src/types/index.ts
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

Поля:

- `id` — уникальный идентификатор товара;
- `description` — описание;
- `image` — путь к изображению;
- `title` — название;
- `category` — категория;
- `price` — цена товара или `null`, если товар нельзя приобрести.

## `TPayment`

Способ оплаты:

```ts
type TPayment = 'card' | 'cash' | '';
```

- `card` — онлайн;
- `cash` — при получении;
- пустая строка — способ оплаты ещё не выбран.

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

Данные заказа:

```ts
interface IOrder extends IBuyer {
    total: number;
    items: string[];
}
```

## `IOrderResult`

Ответ сервера после успешного заказа:

```ts
interface IOrderResult {
    id: string;
    total: number;
}
```

---

# Типы представлений

## `TCardBase`

Общие данные карточек:

```ts
type TCardBase = Pick<
    IProduct,
    'title' | 'price'
>;
```

Идентификатор товара не хранится внутри представления карточки.

## `TCardCatalog`

```ts
type TCardCatalog =
    TCardBase &
    Pick<IProduct, 'category' | 'image'>;
```

## `TCardPreview`

```ts
type TCardPreview =
    TCardCatalog &
    Pick<IProduct, 'description'> & {
        buttonText: string;
        buttonDisabled: boolean;
    };
```

## `TCardBasket`

```ts
type TCardBasket = TCardBase & {
    index: number;
};
```

## `IGalleryView`

```ts
interface IGalleryView {
    items: HTMLElement[];
}
```

## `IBasketView`

```ts
interface IBasketView {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}
```

## `IPageView`

```ts
interface IPageView {
    counter: number;
}
```

## `IModalView`

```ts
interface IModalView {
    content: HTMLElement;
}
```

## `IFormView`

```ts
interface IFormView {
    valid: boolean;
    errors: string;
}
```

## `IOrderFormView`

```ts
interface IOrderFormView extends IFormView {
    payment: TPayment;
    address: string;
}
```

## `IContactsFormView`

```ts
interface IContactsFormView extends IFormView {
    email: string;
    phone: string;
}
```

## `ISuccessView`

```ts
interface ISuccessView {
    total: number;
}
```

---

# Базовые классы

## `Component<T>`

Базовый абстрактный класс компонентов слоя View.

Конструктор:

```ts
constructor(container: HTMLElement)
```

Сохраняет корневой DOM-элемент представления.

Методы:

### `setImage`

```ts
setImage(
    element: HTMLImageElement,
    src: string,
    alt?: string
)
```

Устанавливает изображению `src` и при необходимости `alt`.

### `render`

```ts
render(data?: Partial<T>): HTMLElement
```

Передаёт данные представлению через его сеттеры и возвращает корневой DOM-элемент.

---

## `Api`

Базовый класс для работы с HTTP API.

Конструктор:

```ts
constructor(
    baseUrl: string,
    options: RequestInit = {}
)
```

Методы:

### `get`

Выполняет GET-запрос.

### `post`

Выполняет POST, PUT или DELETE запрос.

### `handleResponse`

Обрабатывает ответ сервера и возвращает данные либо отклонённый Promise.

---

## `EventEmitter`

Брокер событий.

Реализует паттерн **Observer — Наблюдатель**.

Основные методы:

- `on` — подписка на событие;
- `off` — удаление обработчика;
- `emit` — генерация события;
- `onAll` — подписка на все события;
- `offAll` — удаление всех обработчиков;
- `trigger` — создание callback, генерирующего событие.

---

# Модели данных

## `ProductCatalog`

Отвечает за каталог и выбранный для подробного просмотра товар.

Поля:

- `products: IProduct[]`;
- `preview: IProduct | null`;
- `events: IEvents`.

Методы:

### `setProducts`

```ts
setProducts(products: IProduct[]): void
```

Сохраняет товары и генерирует:

```text
catalog:changed
```

### `getProducts`

Возвращает каталог товаров.

### `getProductById`

Возвращает товар по `id`.

### `setPreview`

Сохраняет выбранный товар и генерирует:

```text
preview:changed
```

### `getPreview`

Возвращает выбранный товар.

События модели не передают копию её состояния. Presenter получает актуальные данные через публичные методы модели.

---

## `Basket`

Модель корзины.

Поля:

- `items: IProduct[]`;
- `events: IEvents`.

Методы:

### `getItems`

Возвращает товары корзины.

### `addItem`

Добавляет товар.

### `removeItem`

Удаляет товар.

### `clear`

Очищает корзину.

### `getTotal`

Возвращает общую стоимость.

### `getCount`

Возвращает количество товаров.

### `hasItem`

Проверяет наличие товара по идентификатору.

После изменения списка товаров модель генерирует:

```text
basket:changed
```

Событие не передаёт содержимое корзины. Presenter получает актуальные данные через методы модели.

---

## `Buyer`

Модель данных покупателя.

Хранит:

- способ оплаты;
- адрес;
- email;
- телефон.

Методы:

### `setData`

```ts
setData(data: Partial<IBuyer>): void
```

Обновляет переданные данные.

### `getData`

Возвращает данные покупателя.

### `clear`

Сбрасывает данные в исходное состояние.

### `validate`

Проверяет заполненность полей и возвращает объект ошибок.

После изменения данных генерируется:

```text
buyer:changed
```

Событие не передаёт данные покупателя.

---

# Слой API

## `WebLarekApi`

Класс для взаимодействия с API проекта.

Использует композицию и получает объект, реализующий `IApi`.

Конструктор:

```ts
constructor(api: IApi)
```

Методы:

### `getProducts`

```ts
getProducts(): Promise<IProductsResponse>
```

Получает товары с сервера.

### `createOrder`

```ts
createOrder(
    order: IOrder
): Promise<IOrderResult>
```

Передаёт заказ на сервер.

---

# Представления

## `Card`

Абстрактный базовый класс карточек.

Хранит DOM-элементы:

- названия;
- цены.

Сеттеры:

- `title`;
- `price`.

Также содержит защищённый метод:

```ts
setCategory(
    element: HTMLElement,
    value: string
): void
```

Он устанавливает текст категории и соответствующий CSS-модификатор.

`Card` не хранит идентификатор товара.

---

## `CardCatalog`

Карточка товара в каталоге.

Конструктор:

```ts
constructor(
    container: HTMLElement,
    onClick: () => void
)
```

Получает callback, который вызывается при клике по карточке.

Карточка не знает идентификатор товара и не изменяет модель самостоятельно.

Сеттеры:

- `category`;
- `image`;
- унаследованные `title` и `price`.

---

## `CardPreview`

Представление подробной информации о товаре.

Конструктор:

```ts
constructor(
    container: HTMLElement,
    events: IEvents
)
```

Сеттеры:

- `category`;
- `image`;
- `description`;
- `buttonText`;
- `buttonDisabled`;
- унаследованные `title`;
- `price`.

При нажатии на кнопку покупки или удаления генерирует:

```text
card:action
```

Идентификатор товара через событие не передаётся.

Presenter получает выбранный товар через:

```ts
productCatalog.getPreview()
```

---

## `CardBasket`

Карточка товара в корзине.

Конструктор:

```ts
constructor(
    container: HTMLElement,
    onDelete: () => void
)
```

Получает callback удаления товара.

Сеттер:

- `index`;

а также унаследованные:

- `title`;
- `price`.

Представление не хранит `id` товара.

---

## `Gallery`

Отвечает за отображение каталога.

Сеттер:

```ts
items: HTMLElement[]
```

Заменяет содержимое галереи переданными карточками.

---

## `Basket`

Представление корзины.

Отвечает за:

- список товаров;
- итоговую стоимость;
- доступность кнопки оформления.

Сеттеры:

- `items`;
- `total`;
- `valid`.

Сеттер `items` только передаёт DOM-элементы в список:

```ts
replaceChildren(...value)
```

При пустом списке текст «Корзина пуста» отображается средствами CSS.

При нажатии на кнопку оформления генерируется:

```text
order:open
```

---

## `Page`

Представление шапки сайта.

В качестве корневого контейнера получает:

```text
.header
```

Отвечает за:

- счётчик товаров;
- кнопку открытия корзины.

Сеттер:

```ts
counter: number
```

При клике по корзине генерирует:

```text
basket:open
```

Блокировка прокрутки страницы при открытом модальном окне реализована CSS и не является ответственностью класса `Page`.

---

## `Modal`

Отвечает за модальное окно.

Сеттер:

```ts
content: HTMLElement
```

Методы:

```ts
open(): void
close(): void
```

Закрытие возможно:

- кнопкой закрытия;
- нажатием на фон модального окна.

При запросе закрытия генерируется:

```text
modal:close
```

---

## `Form<T>`

Базовый класс форм.

Отвечает за:

- обработку `input`;
- обработку `submit`;
- отображение ошибок;
- доступность кнопки отправки.

Сеттеры:

- `valid`;
- `errors`.

При изменении обычного поля генерируется событие:

```text
<form>.<field>:change
```

При отправке:

```text
<form>:submit
```

---

## `OrderForm`

Первый этап оформления заказа.

Работает с:

- способом оплаты;
- адресом.

Сеттеры:

- `payment`;
- `address`.

При изменении способа оплаты генерируется:

```text
order.payment:change
```

Изменение адреса через базовый `Form` генерирует:

```text
order.address:change
```

Отправка формы:

```text
order:submit
```

---

## `ContactsForm`

Второй этап заказа.

Работает с:

- email;
- телефоном.

Сеттеры:

- `email`;
- `phone`.

События:

```text
contacts.email:change
contacts.phone:change
contacts:submit
```

---

## `Success`

Представление успешно оформленного заказа.

Сеттер:

```ts
total: number
```

Отображает сумму списания.

При нажатии кнопки закрытия генерируется:

```text
success:close
```

---

# События приложения

## События моделей

| Событие | Описание |
| --- | --- |
| `catalog:changed` | Изменился каталог |
| `preview:changed` | Изменился выбранный товар |
| `basket:changed` | Изменилась корзина |
| `buyer:changed` | Изменились данные покупателя |

Эти события не передают состояние моделей.

Presenter получает актуальные данные через методы моделей.

## События представлений

| Событие | Данные | Описание |
| --- | --- | --- |
| `card:action` | — | Добавить или удалить выбранный товар |
| `basket:open` | — | Открыть корзину |
| `order:open` | — | Перейти к оформлению |
| `order.payment:change` | `{ field, value }` | Изменить оплату |
| `order.address:change` | `{ field, value }` | Изменить адрес |
| `order:submit` | — | Перейти к контактам |
| `contacts.email:change` | `{ field, value }` | Изменить email |
| `contacts.phone:change` | `{ field, value }` | Изменить телефон |
| `contacts:submit` | — | Отправить заказ |
| `modal:close` | — | Закрыть модальное окно |
| `success:close` | — | Закрыть экран успешного заказа |

Для карточек каталога и корзины используются callbacks, переданные Presenter при создании экземпляров представлений.

---

# Работа Presenter

В `main.ts` создаются:

- брокер событий;
- API;
- модели;
- статические представления.

Статические представления создаются один раз:

- `Page`;
- `Gallery`;
- `Modal`;
- `CardPreview`;
- `Basket`;
- `OrderForm`;
- `ContactsForm`;
- `Success`.

Динамически создаются только:

- карточки каталога `CardCatalog`;
- карточки корзины `CardBasket`.

## Изменение каталога

```text
ProductCatalog
→ catalog:changed
→ Presenter
→ ProductCatalog.getProducts()
→ CardCatalog[]
→ Gallery
```

## Выбор товара

```text
CardCatalog
→ callback Presenter
→ ProductCatalog.setPreview(product)
→ preview:changed
→ CardPreview
→ Modal
```

## Работа с корзиной

```text
Basket Model
→ basket:changed
→ Presenter
→ обновление Basket View
→ обновление Page.counter
```

## Формы

```text
View
→ событие изменения поля
→ Presenter
→ Buyer.setData()
→ buyer:changed
→ Presenter
→ обе формы перерисовываются
```

## Инициализация

После регистрации обработчиков Presenter приводит модели к начальному состоянию:

```ts
basket.clear();
buyer.clear();
```

Модели генерируют события, после которых выполняется первоначальный рендер связанных представлений.

После этого Presenter получает каталог товаров с API.

---

# Основные принципы реализации

- состояние приложения хранится в моделях;
- Presenter не хранит дублирующее состояние;
- View не содержит бизнес-логику;
- View не хранит идентификаторы товаров в `dataset`;
- модели сообщают об изменениях событиями;
- события моделей не передают копию состояния;
- Presenter получает данные через публичные методы моделей;
- статические View создаются один раз;
- карточки каталога и корзины создаются динамически;
- каждый класс карточки находится в отдельном файле;
- общая логика карточек находится в базовом классе `Card`;
- базовый `Component` не расширяется дополнительными универсальными DOM-методами.
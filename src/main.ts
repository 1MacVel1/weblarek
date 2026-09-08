import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { WebLarekApi } from './components/WebLarekApi';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket as BasketModel } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import {
    Basket as BasketView,
    CardBasket,
    CardCatalog,
    CardPreview,
    ContactsForm,
    Gallery,
    Modal,
    OrderForm,
    Page,
    Success,
} from './components/View';

import type {
    IOrder,
    IProduct,
    TPayment,
} from './types';


// ========================================
// Брокер событий
// ========================================

const events = new EventEmitter();


// ========================================
// API
// ========================================

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);


// ========================================
// Модели данных
// ========================================

const productCatalog = new ProductCatalog(events);
const basket = new BasketModel(events);
const buyer = new Buyer(events);


// ========================================
// DOM-элементы страницы
// ========================================

const pageContainer =
    ensureElement<HTMLElement>('.page');

const galleryContainer =
    ensureElement<HTMLElement>('.gallery');

const modalContainer =
    ensureElement<HTMLElement>('#modal-container');


// ========================================
// Компоненты представления
// ========================================

const page = new Page(
    pageContainer,
    events
);

const gallery = new Gallery(
    galleryContainer
);

const modal = new Modal(
    modalContainer,
    events
);


// Корзина

const basketElement =
    cloneTemplate<HTMLElement>('#basket');

const basketView = new BasketView(
    basketElement,
    events
);


// Первая форма заказа

const orderElement =
    cloneTemplate<HTMLFormElement>('#order');

const orderForm = new OrderForm(
    orderElement,
    events
);


// Вторая форма заказа

const contactsElement =
    cloneTemplate<HTMLFormElement>('#contacts');

const contactsForm = new ContactsForm(
    contactsElement,
    events
);


// Окно успешного заказа

const successElement =
    cloneTemplate<HTMLElement>('#success');

const success = new Success(
    successElement,
    events
);


// ========================================
// Состояние текущего модального окна
// ========================================

type TModalScreen =
    | 'preview'
    | 'basket'
    | 'order'
    | 'contacts'
    | 'success'
    | null;

let currentModalScreen: TModalScreen = null;


// ========================================
// Вспомогательные функции Presenter
// ========================================

function getFormErrors(
    errors: Array<string | undefined>
): string {
    return errors
        .filter((error): error is string => Boolean(error))
        .join('; ');
}


function renderProductPreview(
    product: IProduct
): void {
    const cardElement =
        cloneTemplate<HTMLElement>('#card-preview');

    const card = new CardPreview(
        cardElement,
        events
    );

    const isInBasket = basket.hasItem(product.id);

    const cardNode = card.render({
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        image: `${CDN_URL}${product.image}`,
        description: product.description,

        buttonText:
            product.price === null
                ? 'Недоступно'
                : isInBasket
                    ? 'Удалить из корзины'
                    : 'В корзину',

        buttonDisabled: product.price === null,
    });

    modal.render({
        content: cardNode,
    });

    modal.open();
}


function renderBasket(): void {
    const items = basket.getItems();

    const basketCards = items.map(
        (product, index) => {
            const cardElement =
                cloneTemplate<HTMLElement>('#card-basket');

            const card = new CardBasket(
                cardElement,
                events
            );

            return card.render({
                id: product.id,
                title: product.title,
                price: product.price,
                index: index + 1,
            });
        }
    );

    basketView.render({
        items: basketCards,
        total: basket.getTotal(),
        valid: items.length > 0,
    });
}


function renderOrderForm(): void {
    const data = buyer.getData();
    const errors = buyer.validate();

    orderForm.render({
        payment: data.payment,
        address: data.address,

        valid:
            !errors.payment &&
            !errors.address,

        errors: getFormErrors([
            errors.payment,
            errors.address,
        ]),
    });
}


function renderContactsForm(): void {
    const data = buyer.getData();
    const errors = buyer.validate();

    contactsForm.render({
        email: data.email,
        phone: data.phone,

        valid:
            !errors.email &&
            !errors.phone,

        errors: getFormErrors([
            errors.email,
            errors.phone,
        ]),
    });
}


// ========================================
// СОБЫТИЯ МОДЕЛЕЙ
// ========================================


// ----------------------------------------
// Изменился каталог товаров
// ----------------------------------------

events.on('catalog:changed', () => {
    const products = productCatalog.getProducts();

    const cards = products.map((product) => {
        const cardElement =
            cloneTemplate<HTMLElement>('#card-catalog');

        const card = new CardCatalog(
            cardElement,
            events
        );

        return card.render({
            id: product.id,
            title: product.title,
            price: product.price,
            category: product.category,
            image: `${CDN_URL}${product.image}`,
        });
    });

    gallery.render({
        items: cards,
    });
});


// ----------------------------------------
// Изменился выбранный товар
// ----------------------------------------

events.on('preview:changed', () => {
    const product = productCatalog.getPreview();

    if (!product) {
        return;
    }

    currentModalScreen = 'preview';

    renderProductPreview(product);
});


// ----------------------------------------
// Изменилась корзина
// ----------------------------------------

events.on('basket:changed', () => {
    page.render({
        counter: basket.getCount(),
    });

    if (currentModalScreen === 'basket') {
        renderBasket();
    }

    if (currentModalScreen === 'preview') {
        const product = productCatalog.getPreview();

        if (product) {
            renderProductPreview(product);
        }
    }
});


// ----------------------------------------
// Изменились данные покупателя
// ----------------------------------------

events.on('buyer:changed', () => {
    if (currentModalScreen === 'order') {
        renderOrderForm();
    }

    if (currentModalScreen === 'contacts') {
        renderContactsForm();
    }
});


// ========================================
// СОБЫТИЯ ПРЕДСТАВЛЕНИЯ
// ========================================


// ----------------------------------------
// Пользователь выбрал товар
// ----------------------------------------

events.on<{ id: string }>(
    'card:select',
    ({ id }) => {
        const product =
            productCatalog.getProductById(id);

        if (!product) {
            return;
        }

        productCatalog.setPreview(product);
    }
);


// ----------------------------------------
// Купить / удалить товар
// ----------------------------------------

events.on<{ id: string }>(
    'card:toggle',
    ({ id }) => {
        const product =
            productCatalog.getProductById(id);

        if (!product || product.price === null) {
            return;
        }

        currentModalScreen = null;

        if (basket.hasItem(id)) {
            basket.removeItem(product);
        } else {
            basket.addItem(product);
        }

        modal.close();
    }
);


// ----------------------------------------
// Открыть корзину
// ----------------------------------------

events.on('basket:open', () => {
    currentModalScreen = 'basket';

    renderBasket();

    modal.render({
        content: basketView.render(),
    });

    modal.open();
});


// ----------------------------------------
// Удалить товар из корзины
// ----------------------------------------

events.on<{ id: string }>(
    'basket:remove',
    ({ id }) => {
        const product =
            basket
                .getItems()
                .find((item) => item.id === id);

        if (!product) {
            return;
        }

        basket.removeItem(product);
    }
);


// ----------------------------------------
// Начать оформление заказа
// ----------------------------------------

events.on('order:open', () => {
    currentModalScreen = 'order';

    renderOrderForm();

    modal.render({
        content: orderForm.render(),
    });

    modal.open();
});


// ----------------------------------------
// Изменение способа оплаты
// ----------------------------------------

events.on<{
    field: string;
    value: TPayment;
}>(
    'order.payment:change',
    ({ value }) => {
        buyer.setData({
            payment: value,
        });
    }
);


// ----------------------------------------
// Изменение адреса
// ----------------------------------------

events.on<{
    field: string;
    value: string;
}>(
    'order.address:change',
    ({ value }) => {
        buyer.setData({
            address: value,
        });
    }
);


// ----------------------------------------
// Первая форма отправлена
// ----------------------------------------

events.on('order:submit', () => {
    currentModalScreen = 'contacts';

    renderContactsForm();

    modal.render({
        content: contactsForm.render(),
    });

    modal.open();
});


// ----------------------------------------
// Изменение email
// ----------------------------------------

events.on<{
    field: string;
    value: string;
}>(
    'contacts.email:change',
    ({ value }) => {
        buyer.setData({
            email: value,
        });
    }
);


// ----------------------------------------
// Изменение телефона
// ----------------------------------------

events.on<{
    field: string;
    value: string;
}>(
    'contacts.phone:change',
    ({ value }) => {
        buyer.setData({
            phone: value,
        });
    }
);


// ----------------------------------------
// Отправка заказа
// ----------------------------------------

events.on('contacts:submit', () => {
    const buyerData = buyer.getData();

    const order: IOrder = {
        ...buyerData,
        total: basket.getTotal(),
        items: basket
            .getItems()
            .map((product) => product.id),
    };

    webLarekApi
        .createOrder(order)
        .then((result) => {
            basket.clear();
            buyer.clear();

            currentModalScreen = 'success';

            modal.render({
                content: success.render({
                    total: result.total,
                }),
            });

            modal.open();
        })
        .catch((error) => {
            console.error(
                'Ошибка оформления заказа:',
                error
            );
        });
});


// ----------------------------------------
// Закрытие модального окна
// ----------------------------------------

events.on('modal:close', () => {
    currentModalScreen = null;

    modal.close();
});


// ----------------------------------------
// Закрытие успешного заказа
// ----------------------------------------

events.on('success:close', () => {
    currentModalScreen = null;

    modal.close();
});


// ========================================
// ПЕРВОНАЧАЛЬНАЯ ЗАГРУЗКА
// ========================================

page.render({
    counter: basket.getCount(),
});

webLarekApi
    .getProducts()
    .then((data) => {
        productCatalog.setProducts(data.items);
    })
    .catch((error) => {
        console.error(
            'Ошибка получения товаров:',
            error
        );
    });
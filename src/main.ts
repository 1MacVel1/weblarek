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
// DOM-элементы
// ========================================

const headerContainer =
    ensureElement<HTMLElement>('.header');

const galleryContainer =
    ensureElement<HTMLElement>('.gallery');

const modalContainer =
    ensureElement<HTMLElement>('#modal-container');


// ========================================
// Компоненты представления
// ========================================

const page = new Page(
    headerContainer,
    events
);

const gallery = new Gallery(
    galleryContainer
);

const modal = new Modal(
    modalContainer,
    events
);


// Карточка подробного просмотра

const cardPreviewElement =
    cloneTemplate<HTMLElement>('#card-preview');

const cardPreview = new CardPreview(
    cardPreviewElement,
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


// Экран успешного заказа

const successElement =
    cloneTemplate<HTMLElement>('#success');

const success = new Success(
    successElement,
    events
);


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
    const isInBasket = basket.hasItem(product.id);

    cardPreview.render({
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
}


function renderBasket(): void {
    const items = basket.getItems();

    const basketCards = items.map(
        (product, index) => {
            const cardElement =
                cloneTemplate<HTMLElement>('#card-basket');

            const card = new CardBasket(
                cardElement,
                () => {
                    basket.removeItem(product);
                }
            );

            return card.render({
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
            () => {
                productCatalog.setPreview(product);

                modal.render({
                    content: cardPreview.render(),
                });

                modal.open();
            }
        );

        return card.render({
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

    renderProductPreview(product);
});


// ----------------------------------------
// Изменилась корзина
// ----------------------------------------

events.on('basket:changed', () => {
    page.render({
        counter: basket.getCount(),
    });

    renderBasket();
});


// ----------------------------------------
// Изменились данные покупателя
// ----------------------------------------

events.on('buyer:changed', () => {
    renderOrderForm();
    renderContactsForm();
});


// ========================================
// СОБЫТИЯ ПРЕДСТАВЛЕНИЙ
// ========================================

// ----------------------------------------
// Купить / удалить товар
// ----------------------------------------

events.on(
    'card:action',
    () => {
        const product =
            productCatalog.getPreview();

        if (!product || product.price === null) {
            return;
        }

        if (basket.hasItem(product.id)) {
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
    modal.render({
        content: basketView.render(),
    });

    modal.open();
});


// ----------------------------------------
// Начать оформление заказа
// ----------------------------------------

events.on('order:open', () => {
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
    modal.close();
});


// ----------------------------------------
// Закрытие успешного заказа
// ----------------------------------------

events.on('success:close', () => {
    modal.close();
});


// ========================================
// ПЕРВОНАЧАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ
// ========================================

basket.clear();
buyer.clear();


// ========================================
// ЗАГРУЗКА ТОВАРОВ
// ========================================

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
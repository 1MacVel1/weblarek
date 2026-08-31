import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';


// Создаём модели

const productCatalog = new ProductCatalog();
const basket = new Basket();
const buyer = new Buyer();


// Проверка модели каталога на тестовых данных

productCatalog.setProducts(apiProducts.items);

console.log(
    'Массив тестовых товаров из каталога:',
    productCatalog.getProducts()
);

const firstProduct = apiProducts.items[0];

if (firstProduct) {
    console.log(
        'Товар по id:',
        productCatalog.getProductById(firstProduct.id)
    );

    productCatalog.setPreview(firstProduct);

    console.log(
        'Выбранный товар:',
        productCatalog.getPreview()
    );
}


// Проверка модели корзины

if (apiProducts.items[0]) {
    basket.addItem(apiProducts.items[0]);
}

if (apiProducts.items[1]) {
    basket.addItem(apiProducts.items[1]);
}

console.log(
    'Товары в корзине:',
    basket.getItems()
);

console.log(
    'Количество товаров в корзине:',
    basket.getCount()
);

console.log(
    'Общая стоимость товаров:',
    basket.getTotal()
);

if (apiProducts.items[0]) {
    console.log(
        'Первый товар есть в корзине:',
        basket.hasItem(apiProducts.items[0].id)
    );

    basket.removeItem(apiProducts.items[0]);
}

console.log(
    'Корзина после удаления товара:',
    basket.getItems()
);

basket.clear();

console.log(
    'Корзина после очистки:',
    basket.getItems()
);


// Проверка модели покупателя

console.log(
    'Ошибки пустых данных покупателя:',
    buyer.validate()
);

buyer.setData({
    payment: 'card',
    address: 'Москва',
    email: 'user@example.com',
    phone: '+79991234567',
});

console.log(
    'Данные покупателя:',
    buyer.getData()
);

console.log(
    'Ошибки после заполнения:',
    buyer.validate()
);

buyer.clear();

console.log(
    'Данные покупателя после очистки:',
    buyer.getData()
);


// Работа с настоящим сервером

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi
    .getProducts()
    .then((data) => {
        productCatalog.setProducts(data.items);

        console.log(
            'Каталог товаров, полученный с сервера:',
            productCatalog.getProducts()
        );
    })
    .catch((error) => {
        console.error(
            'Ошибка получения товаров:',
            error
        );
    });
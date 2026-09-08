export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

// Типы слоя представления

export type TCardBase = Pick<
    IProduct,
    'id' | 'title' | 'price'
>;

export type TCardCatalog =
    TCardBase &
    Pick<IProduct, 'category' | 'image'>;

export type TCardPreview =
    TCardCatalog &
    Pick<IProduct, 'description'> & {
    buttonText: string;
    buttonDisabled: boolean;
};

export type TCardBasket = TCardBase & {
    index: number;
};

export interface IGalleryView {
    items: HTMLElement[];
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    valid: boolean;
}

export interface IPageView {
    counter: number;
}

export interface IModalView {
    content: HTMLElement;
}

export interface IFormView {
    valid: boolean;
    errors: string;
}

export interface IOrderFormView extends IFormView {
    payment: TPayment;
    address: string;
}

export interface IContactsFormView extends IFormView {
    email: string;
    phone: string;
}

export interface ISuccessView {
    total: number;
}
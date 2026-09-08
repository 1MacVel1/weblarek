import type { IProduct, TPayment } from './index';

export type TCardBase = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TCardCatalog = TCardBase &
    Pick<IProduct, 'category' | 'image'>;

export type TCardPreview = TCardCatalog &
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
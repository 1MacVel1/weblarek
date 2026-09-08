import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';
import type {
    TCardBase,
    TCardBasket,
    TCardCatalog,
    TCardPreview,
} from '../../types/view';

export abstract class Card<T extends TCardBase> extends Component<T> {
    protected readonly titleElement: HTMLElement;
    protected readonly priceElement: HTMLElement;

    protected constructor(
        container: HTMLElement,
        protected readonly events: IEvents
    ) {
        super(container);

        this.titleElement =
            ensureElement<HTMLElement>('.card__title', container);

        this.priceElement =
            ensureElement<HTMLElement>('.card__price', container);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        this.setText(
            this.priceElement,
            value === null
                ? 'Бесценно'
                : `${value} синапсов`
        );
    }

    protected applyCategory(
        element: HTMLElement,
        value: string
    ): void {
        Object.values(categoryMap).forEach((className) => {
            element.classList.remove(className);
        });

        const categoryClass =
            categoryMap[value as keyof typeof categoryMap];

        if (categoryClass) {
            element.classList.add(categoryClass);
        }

        this.setText(element, value);
    }
}

export class CardCatalog extends Card<TCardCatalog> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;

    constructor(
        container: HTMLElement,
        events: IEvents
    ) {
        super(container, events);

        this.categoryElement =
            ensureElement<HTMLElement>(
                '.card__category',
                container
            );

        this.imageElement =
            ensureElement<HTMLImageElement>(
                '.card__image',
                container
            );

        this.container.addEventListener('click', () => {
            const id = this.container.dataset.id;

            if (id) {
                this.events.emit('card:select', { id });
            }
        });
    }

    set category(value: string) {
        this.applyCategory(
            this.categoryElement,
            value
        );
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }
}

export class CardPreview extends Card<TCardPreview> {
    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;
    private readonly descriptionElement: HTMLElement;
    private readonly buttonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: IEvents
    ) {
        super(container, events);

        this.categoryElement =
            ensureElement<HTMLElement>(
                '.card__category',
                container
            );

        this.imageElement =
            ensureElement<HTMLImageElement>(
                '.card__image',
                container
            );

        this.descriptionElement =
            ensureElement<HTMLElement>(
                '.card__text',
                container
            );

        this.buttonElement =
            ensureElement<HTMLButtonElement>(
                '.card__button',
                container
            );

        this.buttonElement.addEventListener('click', () => {
            const id = this.container.dataset.id;

            if (id) {
                this.events.emit('card:toggle', { id });
            }
        });
    }

    set category(value: string) {
        this.applyCategory(
            this.categoryElement,
            value
        );
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }

    set description(value: string) {
        this.setText(
            this.descriptionElement,
            value
        );
    }

    set buttonText(value: string) {
        this.setText(
            this.buttonElement,
            value
        );
    }

    set buttonDisabled(value: boolean) {
        this.setDisabled(
            this.buttonElement,
            value
        );
    }
}

export class CardBasket extends Card<TCardBasket> {
    private readonly indexElement: HTMLElement;
    private readonly deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        events: IEvents
    ) {
        super(container, events);

        this.indexElement =
            ensureElement<HTMLElement>(
                '.basket__item-index',
                container
            );

        this.deleteButton =
            ensureElement<HTMLButtonElement>(
                '.basket__item-delete',
                container
            );

        this.deleteButton.addEventListener('click', () => {
            const id = this.container.dataset.id;

            if (id) {
                this.events.emit('basket:remove', { id });
            }
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, value);
    }
}
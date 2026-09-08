import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { IBasketView } from '../../types'

export class Basket extends Component<IBasketView> {
    private readonly listElement: HTMLElement;
    private readonly totalElement: HTMLElement;
    private readonly orderButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

        this.listElement =
            ensureElement<HTMLElement>(
                '.basket__list',
                container
            );

        this.totalElement =
            ensureElement<HTMLElement>(
                '.basket__price',
                container
            );

        this.orderButton =
            ensureElement<HTMLButtonElement>(
                '.basket__button',
                container
            );

        this.orderButton.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set items(value: HTMLElement[]) {
        if (value.length > 0) {
            this.listElement.replaceChildren(...value);
            return;
        }

        const emptyElement = document.createElement('li');

        emptyElement.className = 'basket__empty';
        emptyElement.textContent = 'Корзина пуста';

        this.listElement.replaceChildren(emptyElement);
    }

    set total(value: number) {
        this.setText(
            this.totalElement,
            `${value} синапсов`
        );
    }

    set valid(value: boolean) {
        this.setDisabled(
            this.orderButton,
            !value
        );
    }
}
import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { IBasketView } from '../../types';

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
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent =
            `${value} синапсов`;
    }

    set valid(value: boolean) {
        this.orderButton.disabled = !value;
    }
}
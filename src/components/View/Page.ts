import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { IPageView } from '../../types';

export class Page extends Component<IPageView> {
    private readonly basketButton: HTMLButtonElement;
    private readonly counterElement: HTMLElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

        this.basketButton =
            ensureElement<HTMLButtonElement>(
                '.header__basket',
                container
            );

        this.counterElement =
            ensureElement<HTMLElement>(
                '.header__basket-counter',
                container
            );

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.counterElement.textContent =
            String(value);
    }
}
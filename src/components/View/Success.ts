import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { ISuccessView } from '../../types/view';

export class Success extends Component<ISuccessView> {
    private readonly descriptionElement: HTMLElement;
    private readonly closeButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

        this.descriptionElement =
            ensureElement<HTMLElement>(
                '.order-success__description',
                container
            );

        this.closeButton =
            ensureElement<HTMLButtonElement>(
                '.order-success__close',
                container
            );

        this.closeButton.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.setText(
            this.descriptionElement,
            `Списано ${value} синапсов`
        );
    }
}
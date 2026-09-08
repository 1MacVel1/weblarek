import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { IModalView } from '../../types/view';

export class Modal extends Component<IModalView> {
    private readonly closeButton: HTMLButtonElement;
    private readonly contentElement: HTMLElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

        this.closeButton =
            ensureElement<HTMLButtonElement>(
                '.modal__close',
                container
            );

        this.contentElement =
            ensureElement<HTMLElement>(
                '.modal__content',
                container
            );

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        });

        this.container.addEventListener(
            'mousedown',
            (event) => {
                if (event.target === event.currentTarget) {
                    this.events.emit('modal:close');
                }
            }
        );
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.toggleClass(
            this.container,
            'modal_active',
            true
        );
    }

    close(): void {
        this.toggleClass(
            this.container,
            'modal_active',
            false
        );
    }
}
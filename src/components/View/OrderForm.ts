import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { TPayment } from '../../types';
import type { IOrderFormView } from '../../types/view';
import { Form } from './Form';

export class OrderForm extends Form<IOrderFormView> {
    private readonly addressInput: HTMLInputElement;
    private readonly cardButton: HTMLButtonElement;
    private readonly cashButton: HTMLButtonElement;

    constructor(
        container: HTMLFormElement,
        events: IEvents
    ) {
        super(container, events);

        this.addressInput =
            ensureElement<HTMLInputElement>(
                'input[name="address"]',
                container
            );

        this.cardButton =
            ensureElement<HTMLButtonElement>(
                'button[name="card"]',
                container
            );

        this.cashButton =
            ensureElement<HTMLButtonElement>(
                'button[name="cash"]',
                container
            );

        [this.cardButton, this.cashButton].forEach(
            (button) => {
                button.addEventListener('click', () => {
                    this.events.emit(
                        'order.payment:change',
                        {
                            field: 'payment',
                            value: button.name as TPayment,
                        }
                    );
                });
            }
        );
    }

    set payment(value: TPayment) {
        this.toggleClass(
            this.cardButton,
            'button_alt-active',
            value === 'card'
        );

        this.toggleClass(
            this.cashButton,
            'button_alt-active',
            value === 'cash'
        );
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}
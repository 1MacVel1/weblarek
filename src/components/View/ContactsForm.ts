import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { IContactsFormView } from '../../types/view';
import { Form } from './Form';

export class ContactsForm
    extends Form<IContactsFormView> {

    private readonly emailInput: HTMLInputElement;
    private readonly phoneInput: HTMLInputElement;

    constructor(
        container: HTMLFormElement,
        events: IEvents
    ) {
        super(container, events);

        this.emailInput =
            ensureElement<HTMLInputElement>(
                'input[name="email"]',
                container
            );

        this.phoneInput =
            ensureElement<HTMLInputElement>(
                'input[name="phone"]',
                container
            );
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}
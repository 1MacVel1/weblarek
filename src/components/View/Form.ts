import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { IFormView } from '../../types'

export abstract class Form<T extends IFormView>
    extends Component<T> {

    protected readonly submitButton: HTMLButtonElement;

    private readonly errorsElement: HTMLElement;

    protected constructor(
        protected readonly form: HTMLFormElement,
        protected readonly events: IEvents
    ) {
        super(form);

        this.submitButton =
            ensureElement<HTMLButtonElement>(
                'button[type="submit"]',
                form
            );

        this.errorsElement =
            ensureElement<HTMLElement>(
                '.form__errors',
                form
            );

        this.form.addEventListener('input', (event) => {
            const target = event.target;

            if (!(target instanceof HTMLInputElement)) {
                return;
            }

            this.events.emit(
                `${this.form.name}.${target.name}:change`,
                {
                    field: target.name,
                    value: target.value,
                }
            );
        });

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();

            this.events.emit(
                `${this.form.name}:submit`
            );
        });
    }

    set valid(value: boolean) {
        this.setDisabled(
            this.submitButton,
            !value
        );
    }

    set errors(value: string) {
        this.setText(
            this.errorsElement,
            value
        );
    }
}
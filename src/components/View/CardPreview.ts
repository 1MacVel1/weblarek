import { Card } from './Card';
import type { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import type { TCardPreview } from '../../types';

export class CardPreview
    extends Card<TCardPreview> {

    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;
    private readonly descriptionElement: HTMLElement;
    private readonly buttonElement: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private readonly events: IEvents
    ) {
        super(container);

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

        this.buttonElement.addEventListener(
            'click',
            () => {
                this.events.emit('card:action');
            }
        );
    }

    set category(value: string) {
        this.setCategory(
            this.categoryElement,
            value
        );
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            value
        );
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}
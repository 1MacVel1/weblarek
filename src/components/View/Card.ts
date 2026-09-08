import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import type { TCardBase } from '../../types';

export abstract class Card<T extends TCardBase>
    extends Component<T> {

    protected readonly titleElement: HTMLElement;
    protected readonly priceElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);

        this.titleElement =
            ensureElement<HTMLElement>(
                '.card__title',
                container
            );

        this.priceElement =
            ensureElement<HTMLElement>(
                '.card__price',
                container
            );
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent =
            value === null
                ? 'Бесценно'
                : `${value} синапсов`;
    }

    protected setCategory(
        element: HTMLElement,
        value: string
    ): void {
        Object.values(categoryMap).forEach(
            (className) => {
                element.classList.remove(className);
            }
        );

        const categoryClass =
            categoryMap[
                value as keyof typeof categoryMap
                ];

        if (categoryClass) {
            element.classList.add(categoryClass);
        }

        element.textContent = value;
    }
}
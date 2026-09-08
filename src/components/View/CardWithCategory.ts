import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import type { TCardCatalog } from '../../types';

export abstract class CardWithCategory<
    T extends TCardCatalog
> extends Card<T> {

    protected readonly categoryElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);

        this.categoryElement =
            ensureElement<HTMLElement>(
                '.card__category',
                container
            );
    }

    set category(value: string) {
        Object.values(categoryMap).forEach(
            (className) => {
                this.categoryElement.classList.remove(
                    className
                );
            }
        );

        const categoryClass =
            categoryMap[
                value as keyof typeof categoryMap
                ];

        if (categoryClass) {
            this.categoryElement.classList.add(
                categoryClass
            );
        }

        this.categoryElement.textContent = value;
    }
}
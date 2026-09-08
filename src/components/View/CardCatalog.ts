import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';
import type { TCardCatalog } from '../../types';

export class CardCatalog
    extends Card<TCardCatalog> {

    private readonly categoryElement: HTMLElement;
    private readonly imageElement: HTMLImageElement;

    constructor(
        container: HTMLElement,
        onClick: () => void
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

        this.container.addEventListener(
            'click',
            onClick
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

    set image(value: string) {
        this.setImage(
            this.imageElement,
            value
        );
    }
}
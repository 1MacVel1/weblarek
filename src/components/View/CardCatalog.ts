import { Card } from './Card';
import { ensureElement } from '../../utils/utils';
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
}
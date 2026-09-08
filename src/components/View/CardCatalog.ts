import { CardWithCategory } from './CardWithCategory';
import { ensureElement } from '../../utils/utils';
import type { TCardCatalog } from '../../types';

export class CardCatalog
    extends CardWithCategory<TCardCatalog> {

    private readonly imageElement: HTMLImageElement;

    constructor(
        container: HTMLElement,
        onClick: () => void
    ) {
        super(container);

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

    set image(value: string) {
        this.setImage(
            this.imageElement,
            value
        );
    }
}
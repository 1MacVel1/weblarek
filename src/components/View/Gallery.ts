import { Component } from '../base/Component';
import type { IGalleryView } from '../../types';

export class Gallery extends Component<IGalleryView> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this.container.replaceChildren(...value);
    }
}
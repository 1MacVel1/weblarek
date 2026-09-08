
// Базовый компонент представления.

export abstract class Component<T> {
    protected constructor(
        protected readonly container: HTMLElement
    ) {}

    protected toggleClass(
        element: HTMLElement,
        className: string,
        force?: boolean
    ): void {
        element.classList.toggle(className, force);
    }

    protected setText(
        element: HTMLElement,
        value: unknown
    ): void {
        element.textContent = String(value ?? '');
    }

    protected setDisabled(
        element: HTMLButtonElement | HTMLInputElement,
        state: boolean
    ): void {
        element.disabled = state;
    }

    protected setHidden(element: HTMLElement): void {
        element.style.display = 'none';
    }

    protected setVisible(element: HTMLElement): void {
        element.style.removeProperty('display');
    }

    protected setImage(
        element: HTMLImageElement,
        src: string,
        alt?: string
    ): void {
        element.src = src;

        if (alt !== undefined) {
            element.alt = alt;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
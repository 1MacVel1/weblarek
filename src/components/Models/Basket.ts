import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class Basket {
    private items: IProduct[] = [];

    constructor(private readonly events: IEvents) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);

        this.events.emit('basket:changed', {
            items: this.items,
        });
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter(
            (item) => item.id !== product.id
        );

        this.events.emit('basket:changed', {
            items: this.items,
        });
    }

    clear(): void {
        this.items = [];

        this.events.emit('basket:changed', {
            items: this.items,
        });
    }

    getTotal(): number {
        return this.items.reduce((total, item) => {
            return total + (item.price ?? 0);
        }, 0);
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(
            (item) => item.id === id
        );
    }
}
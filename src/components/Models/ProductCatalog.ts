import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class ProductCatalog {
    private products: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private readonly events: IEvents) {}

    setProducts(products: IProduct[]): void {
        this.products = products;

        this.events.emit('catalog:changed', {
            products: this.products,
        });
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setPreview(product: IProduct): void {
        this.preview = product;

        this.events.emit('preview:changed', {
            product: this.preview,
        });
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}
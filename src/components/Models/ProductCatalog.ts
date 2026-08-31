import { IProduct } from '../../types';

export class ProductCatalog {
    private products: IProduct[] = [];
    private preview: IProduct | null = null;

    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    setPreview(product: IProduct): void {
        this.preview = product;
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}
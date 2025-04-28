import { ProductNotFoundCode } from './codes';
import Exception from './Exception';

class ProductNotFoundException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = ProductNotFoundCode;
        this.name = ProductNotFoundException.name;
    }
}
export default ProductNotFoundException;
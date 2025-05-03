import { ResourceNotFoundExceptionCode } from './codes';
import Exception from './Exception';

class ResourceNotFoundException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = ResourceNotFoundExceptionCode;
        this.name = ResourceNotFoundException.name;
    }
}
export default ResourceNotFoundException;



import { ForbiddenAccessExceptionCode } from './codes';
import Exception from './Exception';

class ForbiddenAccessException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = ForbiddenAccessExceptionCode;
        this.name = ForbiddenAccessException.name;
    }
}
export default ForbiddenAccessException;



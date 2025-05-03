import { UnauthorizedAccessExceptionCode } from './codes';
import Exception from './Exception';

class UnauthorizedAccessException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = UnauthorizedAccessExceptionCode;
        this.name = UnauthorizedAccessException.name;
    }
}
export default UnauthorizedAccessException;



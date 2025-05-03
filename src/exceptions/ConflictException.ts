import { ConflictExceptionCode } from './codes';
import Exception from './Exception';

class ConflictException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = ConflictExceptionCode;
        this.name = ConflictException.name;
    }
}
export default ConflictException;



import { MissingParameterExceptionCode } from './codes';
import Exception from './Exception';

class MissingParameterException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = MissingParameterExceptionCode;
        this.name = MissingParameterException.name;
    }
}
export default MissingParameterException;



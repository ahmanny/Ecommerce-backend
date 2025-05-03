import { TokenExpiredExceptionCode } from './codes';
import Exception from './Exception';

class TokenExpiredException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = TokenExpiredExceptionCode;
        this.name = TokenExpiredException.name;
    }
}
export default TokenExpiredException;



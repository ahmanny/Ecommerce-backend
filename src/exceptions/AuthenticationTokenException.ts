import { AuthenticationTokenExceptionCode } from './codes';
import Exception from './Exception';

class AuthenticationTokenException extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = AuthenticationTokenExceptionCode;
        this.name = AuthenticationTokenException.name;
    }
}
export default AuthenticationTokenException;



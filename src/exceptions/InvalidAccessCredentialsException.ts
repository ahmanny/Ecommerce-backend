import { InvalidAccessCredentialsExceptionsCode } from './codes';
import Exception from './Exception';

class InvalidAccessCredentialsExceptions extends Exception {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = InvalidAccessCredentialsExceptionsCode;
        this.name = InvalidAccessCredentialsExceptions.name;
    }
}
export default InvalidAccessCredentialsExceptions;

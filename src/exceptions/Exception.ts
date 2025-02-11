import { ExceptionCode } from './codes';

class Exception extends Error {
    name: string;
    code: number;
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = ExceptionCode;
        this.name = Exception.name;
    }
}
export default Exception;

import { UserExistCode } from "./codes";
import Exception from "./Exception";

class UserExistException extends Exception {
    public constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.code = UserExistCode
        this.name = UserExistException.name
    }
}
export default UserExistException
import { UserNotFoundCode } from "./codes";
import Exception from "./Exception";

class UserNotFoundException extends Exception {
    public constructor(message?: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype)
        this.code = UserNotFoundCode
        this.name = UserNotFoundException.name
    }
}
export default UserNotFoundException
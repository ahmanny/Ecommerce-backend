import { TUser } from "../../types";
import { Productinterface } from "../../types/product.types";






declare global {
    namespace Express {
        interface Request {
            user?: TUser;
            cloudinaryUrls?: string[];
            product?: Productinterface;
        }
    }
}
export { }

import Exception from "../exceptions/Exception";
import { Disco, getDiscoByName } from "../models/disco.model";
import { getUserByEmail, getUserByName, User } from "../models/user.model";
import { NewDiscoPayloadinterface } from "../types/disco.types";
import { EmailService } from "./email.service";







class DiscoServiceClass {
    constructor() {
        // super()
    }

    public async addNewDiscoService(payload: NewDiscoPayloadinterface, senderName: string, createdBy: string) {
        const discoByName = await getDiscoByName(payload.discoName)

        if (discoByName) {
            throw new Exception('A disco by this name already exists');
        }
        const userByEmail = await getUserByEmail(payload.email)
        const userByName = await getUserByName(payload.name)
        if (userByEmail && userByName) {
            throw new Exception('This account already exists');
        } else if (userByEmail) {
            throw new Exception('This Email is associated with another account')
        }
        const new_disco = await Disco.create({ ...payload });
        const user = await new User({ email: payload.email, name: payload.name, role: 'executive', disco: new_disco._id, createdBy: createdBy }).save()


        await EmailService.sendUserVerificationEmail({
            email: payload.email,
            name: payload.name,
            discoName: payload.discoName,
            senderName: senderName,
            id: user._id
        })

        return {
            new_disco
        }
    }
}



export const DiscoService = new DiscoServiceClass();
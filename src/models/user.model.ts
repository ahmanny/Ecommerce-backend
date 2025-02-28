import mongoose, { Date, Schema, model } from 'mongoose';


export enum UserRoles {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}
const roleOrder = Object.values(UserRoles)




export interface IUser {
    name: string;
    email: string;
    phone: string;
    password: string;
    profilePicture: string
    role: UserRoles;
    createdBy?: Schema.Types.ObjectId;
    isVerified: boolean
}

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.CUSTOMER
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

export const User = model<IUser>('User', UserSchema);




export const canCreateRole = (creatorRole: UserRoles, targetRole: UserRoles): boolean => {
    const roleHierarchy: Record<UserRoles, UserRoles[]> = roleOrder.reduce((hierarchy, role, index) => {
        if (index < roleOrder.length - 2) {
            hierarchy[role] = roleOrder.slice(index + 1) as UserRoles[];
        } else {
            hierarchy[role] = [];
        }
        return hierarchy;
    }, {} as Record<UserRoles, UserRoles[]>);
    return roleHierarchy[creatorRole]?.includes(targetRole) || false;
};

export const canUserCreateRole = async (userId: string, targetRole: UserRoles): Promise<boolean> => {
    const creator = await User.findById(userId);
    return creator ? canCreateRole(creator.role, targetRole) : false;
};











//methods
export const getUsers = () => User.find();
export const getUserByEmail = (email: String) => User.findOne({ email });
export const getUserByName = (name: String) => User.findOne({ name });
export const getUserByRole = (role: String) => User.findOne({ role })
export const getUserByPhone = (phone: string) => User.findOne({ phone })
export const getUserById = (id: String) => User.findById(id).lean();
export const createUser = (values: Record<string, any>) => new User(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => User.findByIdAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id, values)

export const updateUserByEmail = (userEmail: string, values: Record<string, any>) => User.findOneAndUpdate({ email: userEmail }, values, { new: true });


export const getUsersUnderDiscoID = (discoID: String) => User.find({ disco: discoID }).populate({ path: 'disco', select: 'discoName' });
import type { Request, Response, NextFunction } from 'express';
import { getTokenInfo } from '../utils';
import type { TUser } from '../types';
import { canUserCreateRole, UserRoles } from '../models/user.model';
import Exception from '../exceptions/Exception';
import { error_handler } from '../utils/response_handler';
import InvalidAccessCredentialsExceptions from '../exceptions/InvalidAccessCredentialsException';

export class UserMiddleware {
    constructor() { }

    async validateToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = await getTokenInfo({ req });
            if (token?.is_valid_token && token.user) {
                req.user = token.user
            }

            if (!token?.is_valid_token) {
                throw new InvalidAccessCredentialsExceptions("Unauthorized")
            }
            next(); // Proceed to next
        } catch (error) {
            error_handler(error, req, res)
        }
    }



    checkRolePermission() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const targetRole = req.body.role as UserRoles
            const userId = (req.user as TUser)._id;
            try {
                if (!targetRole) {
                    throw new Exception("No role found")
                }
                const isAllowed = await canUserCreateRole(userId, targetRole);
                if (!isAllowed) {
                    throw new Exception('You do not have permission to create this role.')
                }
                next(); // Proceed to next
            } catch (error) {
                error_handler(error, req, res)
            }
        };
    };




    hasAnyRole(roles: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = req?.user;
            try {
                if (!user) {
                    throw new InvalidAccessCredentialsExceptions('Unauthorized user')
                }

                const user_role = user.role;

                const has_role = roles.includes(user_role);

                if (has_role) {
                    return next();
                } else {
                    throw new InvalidAccessCredentialsExceptions('Not authorized')
                }
            } catch (error) {
                error_handler(error, req, res)
            }

        };
    }



    hasRole(role: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const user = req?.user;
            const has_role = Array.isArray(user?.role) ? user.role.includes(role) : user?.role === role;

            return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
        };
    }
}

















// hasAllRole(roles: Array<string>) {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         const user = req?.user;
//         const user_roles = (user)?.role || [];
//         const has_role = roles.every((role) => user_roles.find((e) => e === role));
//         return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
//     };
// }

// hasAnyRole(roles: Array<string>) {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         const user = req?.user;
//         const user_roles = (user)?.role || [];
//         const has_role = roles.some((role) => user_roles.find((e) => e === role));
//         return has_role ? next() : res.status(403).send({ error: 'Access Denied' });
//     };
// }

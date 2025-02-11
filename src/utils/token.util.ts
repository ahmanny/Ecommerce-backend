import type { Request } from 'express';
import { RefreshToken } from '../models/refresh-token.model';
import { JwtService } from '../services/jwt.service';
import type { TUser } from '../types';
import { getUserById } from '../models/user.model';

type TGetTokenInfoArgs = {
    req?: Request,
    token?: string,
    token_type?: 'access' | 'refresh',
}

export const getTokenInfo = async ({ req, token, token_type }: TGetTokenInfoArgs) => {
    if (!req && !token) {
        return console.error('Provide Request or Token');
    }

    try {
        const _token = token ?? req?.headers.authorization?.split(' ')[1];

        if (!_token) {
            console.error('Token not found in request or arguments');
            return { token: null, is_valid_token: false, user: null };
        }

        const is_valid_token = !!JwtService.verify(_token || '', (token_type || 'access'));
        let user: TUser | null = null;


        if (_token && is_valid_token) {
            let { id } = JwtService.decode(_token)?.payload as { id: string };
            let acct = await getUserById(id)
            if (acct) {
                const { _id, ...rest } = acct
                user = {
                    _id: _id.toString(),
                    ...rest
                }
            }
        }
        return {
            token: _token,
            is_valid_token,
            user,
        };
    } catch (error) {
        console.log(error);
    }
};

export const generateTokens = async (user: any) => {
    try {
        const payload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
        };

        const access_token = JwtService.sign(payload, 'access');
        const refresh_token = JwtService.sign(payload, 'refresh');

        const userOfToken = await RefreshToken.findOne({ user_id: user._id });

        if (userOfToken) {
            await RefreshToken.findOneAndUpdate({ user_id: user._id }, { refresh_token });
        } else {
            await RefreshToken.create({ user_id: user._id, refresh_token });
        }

        return Promise.resolve({ access_token, refresh_token });
    } catch (error) {
        console.log(error);
    }
};

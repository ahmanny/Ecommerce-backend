import { Request, Response } from 'express';
import Exception from '../exceptions/Exception';
import InvalidAccessCredentialsExceptions from '../exceptions/InvalidAccessCredentialsException';
import UserExistException from '../exceptions/UserExistException';
import NotFoundException from '../exceptions/NotFoundException';
const HTTP_OK = 200;
const HTTP_CREATED = 201;
const HTTP_BAD_REQUEST = 400;
const HTTP_CONFLICT = 409;
const HTTP_RESOURCE_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;

export const error_handler = (error: unknown, req: Request, res: Response) => {
	if (error instanceof Exception) {
		res.locals.message = error.message;
		if (error instanceof InvalidAccessCredentialsExceptions) {
			res.status(HTTP_UNAUTHORIZED).json({
				message: error.message,
				code: error.code,
			});
		} else if (error instanceof UserExistException) {
			res.status(HTTP_CONFLICT).json({
				message: error.message,
				code: error.code,
			});
		} else if (error instanceof NotFoundException) {
			res.status(HTTP_RESOURCE_NOT_FOUND).json({
				message: error.message,
				code: error.code,
			});
		} else {
			res.status(HTTP_BAD_REQUEST).json({
				message: error.message,
				code: error.code,
			});
		}
	} else {
		res.status(HTTP_INTERNAL_SERVER_ERROR).json({
			message: "An unknown error occurred",
		});
	}

};

export const ok_handler = (res: Response, message?: string, data?: any) => {
	res.status(HTTP_OK).json({ data, message });
};
export const created_handler = (res: Response, message?: string, data?: any) => {
	res.status(HTTP_CREATED).json({ data, message });
};

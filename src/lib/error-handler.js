import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';

/**
 * Function to handle errors from within API endpoints.
 * @param {Error} error
 */
export default function (error) {
	if (error instanceof PrismaClientValidationError) {
		return { body: error.message, status: 400 };
	}
	if (error instanceof PrismaClientKnownRequestError) {
		return { body: { error: error.meta }, status: 400 };
	}
	if (error instanceof SyntaxError) {
		return { body: { error: error.message, hint: 'provide JSON within body' }, status: 400 };
	}
	return { body: { error: 'an unexpected error occured' }, status: 500 };
}

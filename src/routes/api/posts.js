import { PrismaClient } from '@prisma/client/index.js';
import errorHandler from '$lib/error-handler';
const prisma = new PrismaClient();

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	try {
		const posts = await prisma.post.findMany({
			orderBy: {
				id: 'asc'
			}
		});
		return {
			body: posts
		};
	} catch (error) {
		return errorHandler(error);
	}
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
	if (request.headers.get('content-type') !== 'application/json') {
		return {
			body: { error: 'expecting json content-type' },
			status: 400
		};
	}
	try {
		const { entry } = await request.json();
		const newEntry = await prisma.post.create({
			data: {
				entry: entry
			}
		});
		return {
			body: newEntry,
			status: 201
		};
	} catch (error) {
		return errorHandler(error);
	}
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function put({ request }) {
	if (request.headers.get('content-type') !== 'application/json') {
		return {
			body: { error: 'expecting json content-type' },
			status: 400
		};
	}
	try {
		const { entry, id } = await request.json();
		const editedEntry = await prisma.post.update({
			data: {
				entry: entry
			},
			where: {
				id: Number(id)
			}
		});
		return {
			body: editedEntry,
			status: 200
		};
	} catch (error) {
		return errorHandler(error);
	}
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del({ request }) {
	if (request.headers.get('content-type') !== 'application/json') {
		return {
			body: { error: 'expecting json content-type' },
			status: 400
		};
	}
	try {
		const { id } = await request.json();
		const deletedEntry = await prisma.post.delete({
			where: {
				id: Number(id)
			}
		});
		return {
			body: {
				message: `Post ID: ${id} has been deleted.`,
				deletedPost: deletedEntry
			},
			status: 200
		};
	} catch (error) {
		return errorHandler(error);
	}
}

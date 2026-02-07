import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	try {
		const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');

		if (!fs.existsSync(screenshotsDir)) {
			return new Response(JSON.stringify([]), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const files = fs
			.readdirSync(screenshotsDir)
			.filter((file) => file.endsWith('.png'))
			.sort()
			.map((file) => `/screenshots/${file}`);

		return new Response(JSON.stringify(files), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (_error) {
		return new Response(JSON.stringify([]), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

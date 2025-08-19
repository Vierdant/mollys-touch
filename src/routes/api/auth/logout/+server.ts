import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearSelectedProfileId } from '$lib/config/testing';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('access_token', { path: '/' });
  clearSelectedProfileId(cookies);
  return json({ success: true });
};

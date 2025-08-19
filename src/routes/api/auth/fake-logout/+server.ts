import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { clearFakeAuth, clearSelectedProfileId } from '$lib/config/testing';

export const POST: RequestHandler = async ({ cookies }) => {
  try {
    clearFakeAuth(cookies);
    clearSelectedProfileId(cookies);
    console.log('🔧 Fake authentication and profile selection cleared via API');
    return json({
      success: true,
      message: 'Fake authentication cleared'
    });
  } catch (error) {
    console.error('Error clearing fake auth:', error);
    return json({
      success: false,
      error: 'Failed to clear fake authentication'
    }, { status: 500 });
  }
};

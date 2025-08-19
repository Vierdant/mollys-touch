import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { setFakeAuthState, getFakeUser } from '$lib/config/testing';

export const POST: RequestHandler = async ({ cookies }) => {
  try {
    setFakeAuthState(true, getFakeUser(), cookies);
    console.log('🔧 Fake authentication activated via API');
    return json({
      success: true,
      message: 'Fake authentication activated',
      user: getFakeUser()
    });
  } catch (error) {
    console.error('Error activating fake auth:', error);
    return json({
      success: false,
      error: 'Failed to activate fake authentication'
    }, { status: 500 });
  }
};

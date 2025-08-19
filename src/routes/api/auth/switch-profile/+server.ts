import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isFakeAuthEnabled, setSelectedProfileId, getFakeUser } from '$lib/config/testing';

export const POST: RequestHandler = async ({ cookies, request, locals }) => {
  try {
    const { profileId } = await request.json();
    
    if (!profileId) {
      return json({ 
        success: false, 
        error: 'Profile ID is required' 
      }, { status: 400 });
    }
    
    // Check if user is authenticated (either fake or real)
    const isAuthenticated = locals.user || cookies.get('fake_auth_active') === 'true';
    
    if (!isAuthenticated) {
      return json({ 
        success: false, 
        error: 'User must be authenticated to switch profiles' 
      }, { status: 401 });
    }
    
    // Handle fake authentication profile switching
    if (isFakeAuthEnabled() && cookies.get('fake_auth_active') === 'true') {
      // Validate that the profile ID exists for the fake user
      const fakeUser = getFakeUser();
      const profileExists = fakeUser.character.some(char => char.id === profileId);
      
      if (!profileExists) {
        return json({ 
          success: false, 
          error: 'Invalid profile ID' 
        }, { status: 400 });
      }
      
      // Set the selected profile in cookies
      setSelectedProfileId(profileId, cookies);
      
      console.log('🔧 Fake auth profile switched to:', profileId);
      
      return json({ 
        success: true, 
        message: 'Profile switched successfully',
        profileId: profileId
      });
    }
    
    // Handle real authentication profile switching
    if (locals.user) {
      // Validate that the profile ID exists for the real user
      const user = locals.user;
      const profileExists = user.character?.some((char: any) => char.id === profileId);
      
      if (!profileExists) {
        return json({ 
          success: false, 
          error: 'Invalid profile ID' 
        }, { status: 400 });
      }
      
      // Set the selected profile in cookies for real auth too
      setSelectedProfileId(profileId, cookies);
      
      console.log('Real auth profile switched to:', profileId);
      
      return json({ 
        success: true, 
        message: 'Profile switched successfully',
        profileId: profileId
      });
    }
    
    return json({ 
      success: false, 
      error: 'Authentication state not recognized' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Error switching profile:', error);
    return json({ 
      success: false, 
      error: 'Failed to switch profile' 
    }, { status: 500 });
  }
};

// src/routes/api/user/+server.ts
import { json } from '@sveltejs/kit';
import axios from 'axios';
import { OAUTH_CONFIG } from '../../../lib/config/oauth';

export async function GET({ cookies }) {
    const token = cookies.get('access_token');
    if (!token) return json({ error: 'Not authenticated' }, { status: 401 });

    try {
        const { data } = await axios.get(OAUTH_CONFIG.USER_INFO_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return json(data);
    } catch (err) {
        console.error(err);
        return json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function POST({ cookies, request }) {
    const token = cookies.get('access_token');
    if (!token) return json({ error: 'Not authenticated' }, { status: 401 });

    try {
        const userData = await request.json();
        
        // Create user profile using the OAuth token
        const { data } = await axios.post(OAUTH_CONFIG.PROFILE_CREATION_URL, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        return json(data);
    } catch (err: any) {
        console.error('Failed to create user profile:', err);
        return json({ error: 'Failed to create user profile' }, { status: 500 });
    }
}

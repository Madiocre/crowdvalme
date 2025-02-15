import { auth } from '../firebase';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error('No auth token');

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Check for HTML responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/html')) {
      throw new Error('API endpoint returned HTML instead of JSON');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
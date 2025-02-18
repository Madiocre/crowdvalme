/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '../firebase';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  try {
    // Get the current user
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get a fresh token each time to ensure it's valid
    const token = await user.getIdToken(true);
    localStorage.setItem("token", token); // Update localStorage with fresh token
    
    // Prepare headers with the fresh token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    // Make the API call
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("fetchWithAuth error:", error);
    
    // Handle authentication errors - redirect to login if needed
    if (error.message === "User not authenticated" || 
        error.message === "Unauthorized" || 
        error.message === "Invalid session") {
      // Redirect to login
      window.location.href = "/signin";
    }
    
    throw error;
  }
}

// export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
//   try {
//     let token = await auth.currentUser?.getIdToken(true); // Force refresh if needed
    
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         ...options.headers,
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     // Handle 401 Unauthorized
//     if (response.status === 401) {
//       token = await auth.currentUser?.getIdToken(true);
//       const retryResponse = await fetch(url, {
//         ...options,
//         headers: {
//           ...options.headers,
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return handleResponse(retryResponse);
//     }

//     return handleResponse(response);
//   } catch (error) {
//     console.error('API call failed:', error);
//     throw error;
//   }
// };

// const handleResponse = async (response: Response) => {
//   const contentType = response.headers.get('content-type');
//   if (contentType?.includes('text/html')) {
//     throw new Error('API endpoint returned HTML instead of JSON');
//   }

//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.error || 'API request failed');
//   }

//   return response.json();
// };
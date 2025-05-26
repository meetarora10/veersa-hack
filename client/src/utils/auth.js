import Cookies from 'js-cookie';

export const logout = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // Clear local storage
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

export const checkSession = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-session`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error('Session check failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userRole', data.role);
      return data;
    }
    return null;
  } catch (error) {
    console.error('Session check error:', error);
    return null;
  }
}; 
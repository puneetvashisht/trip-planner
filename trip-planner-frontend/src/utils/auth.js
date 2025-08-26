import Cookies from 'js-cookie';

export const getToken = () => {
  return Cookies.get('jwt_token');
};

export const setToken = (token) => {
  // Cookies.set('jwt_token', token, { expires: 1 }); // 1 day
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  // Cookies.remove('jwt_token');
  localStorage.removeItem('token');
};

export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    return null;
  }
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};